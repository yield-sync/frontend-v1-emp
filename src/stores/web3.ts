import { defineStore } from 'pinia'
import Web3 from 'web3'


interface Web3State {
	web3: Web3 | null
	account: string | null
	networkId: bigint | null
	isConnected: boolean
	error: string | null
}

interface Web3Getters {
	[key: string]: (state: Web3State) => any;
	shortAccount: (state: Web3State) => string | null
}

interface Web3Actions {
	connectWallet: () => Promise<void>
	disconnectWallet: () => void
}


export const useWeb3Store = defineStore<'web3', Web3State, Web3Getters, Web3Actions>(
	'web3',
	{
		state: () => ({
			web3: null,
			account: null,
			networkId: null,
			isConnected: false,
			error: null,
		}),

		getters: {
			shortAccount: (state: Web3State): string | null => {
				if (!state.account) return null
				return `${state.account.substring(0, 6)}...${state.account.substring(state.account.length - 4)}`
			},
		},

		actions: {
			async connectWallet() {
				if (window.ethereum) {
					try {
						const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

						this.web3 = new Web3(window.ethereum)
						this.account = accounts[0]
						this.networkId = await this.web3.eth.net.getId()
						this.isConnected = true
						this.error = null

						window.ethereum.on('accountsChanged', (accounts: any) => {
							this.account = accounts[0] || null
							if (!this.account) this.isConnected = false
						})

						window.ethereum.on('chainChanged', async () => {
							if (this.web3) {
								this.networkId = await this.web3.eth.net.getId()
							}
						})

					}
					catch (error: any) {
						if (error.code === 4001) {
							this.error = 'User denied account access.'
						}
						else {
							console.error('Unexpected error:', error)
							this.error = 'Unexpected error occurred during wallet connection. Please try again.'
						}
					}
				}
				else {
					console.error('No Ethereum provider found. Install MetaMask.')
					this.error = 'No Ethereum provider found. Install MetaMask.'
				}
			},

			disconnectWallet() {
				this.web3 = null
				this.account = null
				this.networkId = null
				this.isConnected = false
				this.error = null
			},
		},
	}
)
