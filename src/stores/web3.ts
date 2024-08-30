import { defineStore } from "pinia";
import Web3 from "web3";


interface Web3State {
	web3: Web3 | null
	accounts: string[] | null
	networkId: bigint | null
	isConnected: boolean
	error: string | null
}

interface Web3Getters {
}

interface Web3Actions {
	connectWallet: () => Promise<void>
	disconnectWallet: () => void
}


export const useWeb3Store = defineStore<"web3", Web3State, Web3Getters, Web3Actions>(
	"web3",
	{
		state: () =>
		{
			return {
				web3: null,
				account: null,
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
						this.networkId = await this.web3.eth.net.getId();
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
								this.networkId = await this.web3.eth.net.getId();
							}
						});

					}
					// eslint-disable-next-line
					catch (error: unknown)
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
		},
	}
);
