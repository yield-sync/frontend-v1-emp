import { defineStore } from "pinia";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import type { AbiItem } from "web3-utils";

import YieldSyncGovernance from "@/abi/YieldSyncGovernance";
import config from "@/config";


interface AppWeb3State
{
	web3: Web3 | null,
	accounts: string[] | null,
	networkId: number | null,
	isConnected: boolean,
	error: string | null,
	contracts: {
		yieldSyncGovernance: Contract<AbiItem[]> | null,
	},
}

interface AppWeb3Actions
{
	connectWallet(): Promise<void>,
	disconnectWallet(): void,
	initialize(): Promise<void>
	setYieldSyncGovernance(): void
	setWalletValues(): Promise<void>,
	switchNetwork(networkId: string): Promise<void>,
}


const NO_WINDOW_ETHEREUM_ERROR: string = "No Ethereum provider found, please install a wallet";


export const useAppWeb3Store = defineStore<"AppWeb3", AppWeb3State, {}, AppWeb3Actions>(
	"AppWeb3",
	{
		state: () =>
		{
			return {
				web3: null,
				accounts: null,
				networkId: null,
				isConnected: false,
				error: null,
				contracts: {
					yieldSyncGovernance: null,
				}
			};
		},

		getters: {
		},

		actions: {
			disconnectWallet(): void
			{
				localStorage.removeItem("walletAddress");

				this.web3 = null;
				this.accounts = null;
				this.networkId = null;
				this.isConnected = false;
				this.error = null;
			},

			async setWalletValues(): Promise<void>
			{
				if (!window.ethereum)
				{
					this.error = NO_WINDOW_ETHEREUM_ERROR;

					return;
				}

				try
				{
					this.web3 = new Web3(window.ethereum);
					this.accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
					this.networkId = Number(await this.web3.eth.net.getId());
					this.isConnected = true;
					this.error = null;
				}
				catch (error: any)
				{
					if (error.code === 4001)
					{
						this.error = "User denied account access.";

						return;
					}

					this.error = String(error);
				}
			},

			async connectWallet(): Promise<void>
			{
				if (!window.ethereum)
				{
					this.error = NO_WINDOW_ETHEREUM_ERROR;

					return;
				}

				try
				{
					await this.setWalletValues();

					window.ethereum.on("accountsChanged", (accounts: string[]) =>
					{
						if (!accounts)
						{
							this.disconnectWallet();

							return;
						}

						this.accounts = accounts;
					});

					window.ethereum.on("chainChanged", async () =>
					{
						if (this.web3)
						{
							await this.setWalletValues();
						}
					});

				}
				catch (error: any)
				{
					if (error.code === 4001)
					{
						this.error = "User denied account access.";

						return;
					}

					this.error = String(error);
				}
			},

			async switchNetwork(chainId: string): Promise<void>
			{
				try
				{
					if (!window.ethereum)
					{
						this.error = NO_WINDOW_ETHEREUM_ERROR;

						return;
					}

					if (!this.web3)
					{
						this.error = "No web3 found";

						return;
					}

					await window.ethereum.request({
						method: "wallet_switchEthereumChain",
						params: [
							{
								chainId: chainId
							},
						],
					});

					await this.setWalletValues();

					await this.setYieldSyncGovernance();
				}
				catch (error)
				{
					this.error = String(error);

					return;
				}
			},

			setYieldSyncGovernance(): void
			{
				if (!this.web3)
				{
					this.error = "Failed to set YS Gov because no web3 found";

					return;
				}

				this.contracts.yieldSyncGovernance = new this.web3.eth.Contract(
					YieldSyncGovernance as AbiItem[],
					config.networkChain[config.getChainName(this.networkId)].yieldSyncGovernance
				)
			},

			async initialize(): Promise<void>
			{
				await this.connectWallet();

				await this.setYieldSyncGovernance();
			}
		},
	}
);
