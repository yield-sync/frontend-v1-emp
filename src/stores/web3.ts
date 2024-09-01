import { defineStore } from "pinia";
import Web3 from "web3";


interface Web3State {
	web3: Web3 | null
	accounts: string[] | null
	networkId: Number | null
	isConnected: boolean
	error: string | null
}

interface Web3Actions {
	connectWallet: () => Promise<void>
	disconnectWallet: () => void
	switchNetwork: (networkId: string) => Promise<void>
}


export const useWeb3Store = defineStore<"web3", Web3State, {}, Web3Actions>(
	"web3",
	{
		state: () =>
		{
			return {
				web3: null,
				accounts: null,
				networkId: null,
				isConnected: false,
				error: null,
			};
		},

		getters: {
		},

		actions: {
			async connectWallet()
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

			disconnectWallet()
			{
				this.web3 = null;
				this.accounts = null;
				this.networkId = null;
				this.isConnected = false;
				this.error = null;
			},

			async switchNetwork(chainId: string)
			{
				try
				{
					if (!window.ethereum)
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
				}
				catch (error)
				{
					this.error = String(error);

					return;
				}
			}
		},
	}
);
