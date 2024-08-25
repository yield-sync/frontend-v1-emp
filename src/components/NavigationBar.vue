<template>
	<VSheet color="transparent">
		<VContainer>
			<VRow>
				<VCol cols="12" lg="8">
					<RouterLink to="/">
						<VBtn variant=plain color="primary">Home</VBtn>
					</RouterLink>

					<RouterLink to="/about">
						<VBtn variant=plain color="primary">About</VBtn>
					</RouterLink>
				</VCol>

				<VCol cols="12" lg="4">
					<VBtn
						v-if="!web3Store.isConnected" @click="web3Store.connectWallet"
						variant="tonal"
						color="white"
						class="w-100 rounded-pill"
					>Connect Wallet</VBtn>

					<VBtn
						v-else @click="web3Store.disconnectWallet"
						variant="tonal"
						color="white"
						class="w-100 rounded-pill"
					>Disconnect</VBtn>
					<p v-if="web3Store.error">{{ web3Store.error }}</p>
				</VCol>
			</VRow>
			<VRow>
				<VCol cols="12">
					<p>
						Wallet Connected: {{ web3Store.shortAccount }}<br/>
						Network ID: {{ web3Store.networkId }}
					</p>
				</VCol>
			</VRow>
		</VContainer>
	</VSheet>
</template>

<script setup>
	import { RouterLink } from 'vue-router';

	import { useWeb3Store } from '@/stores/web3';


	const web3Store = useWeb3Store();
</script>
