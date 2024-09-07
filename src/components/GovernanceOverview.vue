<template>
	<MainContainer title="YS Govnernance">
		<h4>Governance Address:</h4>

		<h5>{{ governance }}</h5>

		<br/>

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
	const defaultAdminRole = ref("?");


	const getGovernance = () =>
	{
		return appWeb3Store.contracts.yieldSyncGovernance.options.address ?
			appWeb3Store.contracts.yieldSyncGovernance.options.address
			:
			"?"
		;
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
				defaultAdminRole.value = await getDefaultAdminRole();
			}
		},
		{
			immediate: true 
		}
	);
</script>
