import { defineStore } from "pinia";
import Web3 from "web3";


interface State
{
	walletConnected: boolean,
	web3: Web3 | null,
	accounts: string[] | null,
	networkId: number | null,
	error: string | null,
}


interface Actions
{
	connectWallet(): Promise<void>,
	disconnectWallet(): void,
	initialize(): Promise<void>
	setWalletValues(): Promise<void>,
	switchNetwork(networkId: string): Promise<void>,
}


const NO_WINDOW_ETHEREUM_ERROR: string = "No Ethereum provider found, please install a wallet";


export const useWeb3WalletStore = defineStore<"Web3Wallet", State, {}, Actions>(
	"Web3Wallet",
	{
		state: () =>
		{
			return {
				walletConnected: false,
				web3: null,
				accounts: null,
				networkId: null,
				error: null,
			};
		},

		actions: {
			disconnectWallet(): void
			{
				localStorage.removeItem("walletAddress");

				this.walletConnected = false;
				this.web3 = null;
				this.accounts = null;
				this.networkId = null;
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
					this.accounts = await window.ethereum.request({
						method: "eth_requestAccounts"
					});
					this.networkId = Number(await this.web3.eth.net.getId());
					this.walletConnected = true;
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
				}
				catch (error)
				{
					this.error = String(error);

					return;
				}
			},

			async initialize(): Promise<void>
			{
				await this.connectWallet();
			}
		},
	}
);
