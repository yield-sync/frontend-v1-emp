<template>
	<MainContainer title="YS Govnernance">
		<h4 class="text-center text-light">{{ governance }}</h4>

		<br/>

		<h4>Pay To:</h4>

		<h5>{{ defaultAdminRole }}</h5>

		<br>

		<h4>Default Admin Role:</h4>

		<h5>{{ defaultAdminRole }}</h5>
	</MainContainer>
</template>

<script setup>
	import { ref, watch } from "vue";

	import MainContainer from "@/components/MainContainer.vue";
	import { useAppWeb3Store } from "@/stores/AppWeb3";


	const appWeb3Store = useAppWeb3Store();

	const governance = ref("?");
	const payTo = ref("?");
	const defaultAdminRole = ref("?");


	const getGovernance = () =>
	{
		return appWeb3Store.contracts.yieldSyncGovernance.options.address ?
			appWeb3Store.contracts.yieldSyncGovernance.options.address
			:
			"?"
		;
	};


	const getPayTo = () =>
	{
		if (appWeb3Store.contracts.yieldSyncGovernance)
		{
			return appWeb3Store.contracts.yieldSyncGovernance.methods.payTo().call().then((result) =>
			{
				return result;
			}).catch((error) =>
			{
				console.error("Error:", error);
			});
		}
	};


	const getDefaultAdminRole = () =>
	{
		if (appWeb3Store.contracts.yieldSyncGovernance)
		{
			return appWeb3Store.contracts.yieldSyncGovernance.methods.DEFAULT_ADMIN_ROLE().call().then((result) =>
			{
				return result;
			}).catch((error) =>
			{
				console.error("Error:", error);
			});
		}
	};


	watch(
		() =>
		{
			return appWeb3Store.contracts.yieldSyncGovernance;
		},
		async (newValue) =>
		{
			if (newValue)
			{
				governance.value = await getGovernance();
				payTo.value = await getPayTo();
				defaultAdminRole.value = await getDefaultAdminRole();
			}
		},
		{
			immediate: true
		}
	);
</script>
