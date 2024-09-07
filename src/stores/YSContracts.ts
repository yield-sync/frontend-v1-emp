import { defineStore } from "pinia";
import { watch } from "vue";
import { Contract } from "web3-eth-contract";
import type { AbiItem } from "web3-utils";

import YieldSyncGovernance from "@/abi/YieldSyncGovernance";
import config from "@/config";

import { useWeb3WalletStore } from "@/stores/Web3Wallet";


interface State
{
	error: string | null,
	yieldSyncGovernance: Contract<AbiItem[]> | null,
}

interface Actions
{
	setYieldSyncGovernance(): void,
	initialize(): Promise<void>,
}


export const useYSContractsStore = defineStore<"YSContracts", State, {}, Actions>(
	"YSContracts",
	{
		state: () =>
		{
			return {
				error: null,
				yieldSyncGovernance: null,
			};
		},

		actions: {
			setYieldSyncGovernance(): void
			{
				const web3Wallet = useWeb3WalletStore();

				if (!web3Wallet.web3)
				{
					this.error = "Failed to set YS Gov because no web3 found";

					return;
				}

				this.yieldSyncGovernance = new web3Wallet.web3.eth.Contract(
					YieldSyncGovernance as AbiItem[],
					config.networkChain[config.getChainName(web3Wallet.networkId)].yieldSyncGovernance
				);
			},

			async initialize(): Promise<void>
			{
				await this.setYieldSyncGovernance();

				const web3Wallet = useWeb3WalletStore();

				watch(
					() => web3Wallet.networkId,
					async (networkIdNew, networkIdOld) =>
					{
						if (networkIdNew != networkIdOld)
						{
							await this.setYieldSyncGovernance();
						}
					}
				);
			}
		},
	}
);
