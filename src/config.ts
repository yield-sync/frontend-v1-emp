type NetworkChain = {
	chainId: string,
	chainName: string,
	nativeCurrency: {
		name: string,
		symbol: string,
		decimals: number,
	},
	rpcUrls: string[],
	blockExplorerUrls: string[]
	icon: any,
	yieldSyncGovernance: string
}


import ethLogo from "./assets/eth.svg";


const config: {
	getChainName: any,
	networkChain: {
		[key: string]: NetworkChain
	},
} = {
	getChainName: (chainId: number) => {
		switch (chainId)
		{
			case 1:
				return "mainnet";

			case 11155111:
				return "sepolia";

			case 420:
				return "optimisticGoerli";

			default:
				return "unknown";
		}
	},

	networkChain: {
		// Mainnet
		mainnet: {
			chainId: "0x1",
			chainName: "Ethereum Mainnet",
			nativeCurrency: {
				name: "ETH",
				symbol: "ETH",
				decimals: 18
			},
			rpcUrls: [
			],
			blockExplorerUrls: [
				"https://etherscan.io",
			],
			icon: ethLogo,
			yieldSyncGovernance: "0x0000000000000000000000000000000000000000",
		},

		// Seploia
		sepolia: {
			chainId: "0xAA36A7",
			chainName: "Ethereum Sepolia",
			nativeCurrency: {
				name: "ETH",
				symbol: "ETH",
				decimals: 18
			},
			rpcUrls: [
			],
			blockExplorerUrls: [
				"https://etherscan.io",
			],
			icon: ethLogo,
			yieldSyncGovernance: "0x2dbd8bA2F7C400f15d8779F4bB234f0CD60e4617",

		},

		// Optimistic Goerli
		optimisticGoerli: {
			chainId: "0x1A4",
			chainName: "Optimistic Görli",
			nativeCurrency: {
				name: "GOR",
				symbol: "GOR",
				decimals: 18
			},
			rpcUrls: [
			],
			blockExplorerUrls: [
				"https://etherscan.io",
			],
			icon: ethLogo,
			yieldSyncGovernance: "0x0000000000000000000000000000000000000000",

		},

		// Unknown
		unknown: {
			chainId: "",
			chainName: "Unknown",
			nativeCurrency: {
				name: "",
				symbol: "",
				decimals: 18
			},
			rpcUrls: [
			],
			blockExplorerUrls: [
				"",
			],
			icon: ethLogo,
			yieldSyncGovernance: "",
		}
	},
};

export default config;
