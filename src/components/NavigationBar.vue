<template>
	<VSheet color="transparent">
		<VContainer>
			<VRow>
				<VCol
					cols="12"
					lg="4"
				>
					<RouterLink to="/" style="letter-spacing: 4px; text-decoration: none !important">
						<h1
							class="text-primary text-uppercase"
							style="letter-spacing: 4px;"
						>
							Yield Sync
						</h1>
					</RouterLink>
				</VCol>

				<VCol
					cols="12"
					lg="4"
				>
					<VBtn
						variant="tonal"
						color="white"
						class="w-100 rounded-xl container1 elevation-0"
					>
						<img
							:src="config.networkChain[config.getChainName(web3Store.networkId)].icon"
							alt="Description of Image"
							class="mr-2"
							style="max-width: 20px;"
						/>

						<h5 class="mx-auto text-center text-light">
							{{ config.getChainName(web3Store.networkId) }} ⦁ {{ web3Store.networkId }}
						</h5>

						<VMenu activator="parent">
							<VList class="mt-3 px-0 py-0 rounded-xl bg-light-frost elevation-0">
								<VListItem v-for="(n, key) in config.networkChain" :key="key">
									<VListItemTitle @click="switchNetwork(String(key))">
										{{ n.chainName }}
									</VListItemTitle>
								</VListItem>
							</VList>
						</VMenu>
					</VBtn>
				</VCol>

				<VCol
					cols="12"
					lg="4"
				>
					<VBtn
						v-if="!web3Store.isConnected"
						@click="web3Store.connectWallet"
						color="dark"
						variant="tonal"
						class="w-100 rounded-pill"
					>
						Connect Wallet
					</VBtn>

					<VBtn
						v-else
						@click="web3Store.disconnectWallet"
						color="white"
						variant="tonal"
						class="w-100 rounded-pill"
					>
						Disconnect ⦁ {{ web3Store.accounts ? shortener(web3Store.accounts[0]) : "" }}
					</VBtn>
				</VCol>

				<VCol
					cols="12"
					md="7"
					lg="8"
					xl="9"
					class="text-left"
				>
					<RouterLink to="/" class="mr-2 text-decoration-none text-dark">
						<VBtn
							variant="plain"
							color="primary"
							class="rounded-xl"
						>
							<h3>V1 EMP</h3>
						</VBtn>
					</RouterLink>
				</VCol>

				<VCol
					cols="12"
					md="5"
					lg="4"
					xl="3"
					class="text-right"
				>
					<VTextField
						label="Insert Alchemy API Key Here"
						variant="outlined"
						hide-details
					/>
				</VCol>
			</VRow>
		</VContainer>
	</VSheet>
</template>


<script lang="ts" setup>
	import { RouterLink } from "vue-router";

	import config from "@/config";
	import { useWeb3Store } from "@/stores/web3";


	const web3Store = useWeb3Store();

	const shortener = (
		subject: string | null
	) => subject ? subject.substring(0, 4) + "..." + subject.substring(subject.length - 4) : "";

	const switchNetwork = async (networkChainKey: string) =>
	{
		web3Store.switchNetwork(config.networkChain[networkChainKey].chainId);
	}
</script>

<style lang="scss" scoped>
.container1 {
	display: flex;
}
</style>
