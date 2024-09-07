<template>
	<MainContainer title="YS Govnernance">
		<h3 class="text-center text-dark">{{ getAddress() }}</h3>
	</MainContainer>
</template>

<script setup>
	import MainContainer from "@/components/MainContainer.vue";
	import { useAppWeb3Store } from "@/stores/AppWeb3";

	const appWeb3Store = useAppWeb3Store();

	const getAddress = () =>
	{
		return appWeb3Store.contracts.yieldSyncGovernance ?
			appWeb3Store.contracts.yieldSyncGovernance.options.address ?
				appWeb3Store.contracts.yieldSyncGovernance.options.address
			:
				"?"
		:
			"Contract not set.."
		;
	}
</script>
