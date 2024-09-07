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
	switchNetwork(networkId: string): Promise<void>,
	setYieldSyncGovernance(): void
	initializeAppWeb3(): Promise<void>
}


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
			async connectWallet(): Promise<void>
			{
				if (window.ethereum)
				{
					try
					{
						const accounts = await window.ethereum.request({
							method: "eth_requestAccounts"
						});

						this.web3 = new Web3(window.ethereum);
						this.accounts = accounts;
						this.networkId = Number(await this.web3.eth.net.getId());
						this.isConnected = true;
						this.error = null;

						window.ethereum.on("accountsChanged", (accounts: string[]) =>
						{
							this.accounts = accounts || null;
							if (!this.accounts) this.isConnected = false;
						});

						window.ethereum.on("chainChanged", async () =>
						{
							if (this.web3)
							{
								this.networkId = Number(await this.web3.eth.net.getId());
							}
						});

					}
					// eslint-disable-next-line
					catch (error: any)
					{
						// eslint-disable-next-line
						if (error.code === 4001)
						{
							this.error = "User denied account access.";
						}
						else
						{
							console.error("Unexpected error:", error);
							this.error = "Unexpected error occurred during wallet connection. Please try again.";
						}
					}
				}
				else
				{
					console.error("No Ethereum provider found. Install MetaMask.");
					this.error = "No Ethereum provider found. Install MetaMask.";
				}
			},

			disconnectWallet(): void
			{
				this.web3 = null;
				this.accounts = null;
				this.networkId = null;
				this.isConnected = false;
				this.error = null;
			},

			async switchNetwork(chainId: string): Promise<void>
			{
				try
				{
					if (!window.ethereum || !this.web3)
					{
						this.error = "Network could not be changed";
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

					this.networkId = Number(await this.web3.eth.net.getId());
				}
				catch (error)
				{
					this.error = String(error);

					return;
				}
			},

			setYieldSyncGovernance(): void
			{
				if (this.web3)
				{
					console.log("Setting YieldSync Governance contract..");

					this.contracts.yieldSyncGovernance = new this.web3.eth.Contract(
						YieldSyncGovernance as AbiItem[],
						config.networkChain[config.getChainName(this.networkId)].yieldSyncGovernance
					)
				}
				else
				{
					console.log("Failed to set YieldSync Governance contract because web3 found..");
				}
			},

			async initializeAppWeb3(): Promise<void>
			{
				await this.connectWallet();

				await this.setYieldSyncGovernance();
			}
		},
	}
);
