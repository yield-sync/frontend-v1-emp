<template>
	<div class="bg-gradient-dark" style="background-attachment: fixed; background-size: cover;">
		<VSheet color="transparent" class="bg-gradient-dark">
			<VContainer>
				<VRow>
					<VCol cols="12" lg="4">
						<RouterLink to="/">
							<VBtn variant="plain" color="primary" class="w-100">Home</VBtn>
						</RouterLink>

						<RouterLink to="/about">
							<VBtn variant="plain" color="primary" class="w-100">About</VBtn>
						</RouterLink>
					</VCol>
				</VRow>
			</VContainer>
		</VSheet>
	</div>
</template>

<script setup>
	import { RouterLink } from "vue-router";
</script>
