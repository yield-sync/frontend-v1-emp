import ethLogo from "./assets/eth.svg";
import baseLogo from "./assets/base.svg";


const config: {
	getChainName: any,
	networkChain: {
		[key: string]: {
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
	},
} = {
	getChainName: (chainId: number) =>
	{
		switch (chainId)
		{
			case 1:
				return "mainnet";

			case 11155111:
				return "sepolia";

			case 84532:
				return "base-sepolia";

			default:
				return "mainnet";
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
			yieldSyncGovernance: "0x86BD4296Ba41375504bfFa2cd4C1Eedec9b09fA4",

		},

		// base sepolia
		"base-sepolia": {
			chainId: "0x14a34",
			chainName: "Base Sepolia",
			nativeCurrency: {
				name: "ETH",
				symbol: "ETH",
				decimals: 18
			},
			rpcUrls: [
			],
			blockExplorerUrls: [
				"	https://sepolia-explorer.base.org",
			],
			icon: baseLogo,
			yieldSyncGovernance: "0x9a26BDc0F40Ca662816d0b05072FA38b34a4c489",
		},
	},
};

export default config;
