<template>
	<div class="app-container">
		<NavigationBar/>

		<RouterView/>

		<FooterBar/>
	</div>
</template>

<script setup>
	import { onMounted } from "vue";
	import { RouterView } from "vue-router";

	import FooterBar from "@/components/FooterBar.vue";
	import NavigationBar from "@/components/NavigationBar.vue";
	import { useAppWeb3Store } from "@/stores/AppWeb3";


	const appWeb3Store = useAppWeb3Store();

	onMounted(async () =>
	{
		await appWeb3Store.initialize();
	});
</script>

<style lang="scss" scoped>
	@import "@/assets/styles/variables.scss";

	.app-container {
		background-attachment: fixed;
		background-size: cover;

		@extend .bg-gradient;
	}
</style>
