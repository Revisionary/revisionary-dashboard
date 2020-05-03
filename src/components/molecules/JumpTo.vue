<template>
	<details class="jump-to">
		<summary class="selectbox">
			Jump to...
			<CaretDownIcon />
		</summary>
		<div class="details-menu">
			<ul>
				<li>Project 1</li>
			</ul>
		</div>
	</details>
</template>

<script>
	import CaretDownIcon from "~/components/atoms/icon-caret-down.vue";

	export default {
		components: {
			CaretDownIcon
		},
		data() {
			return {};
		}
	};
</script>

<style lang="scss">
	.jump-to {
		margin-left: 120px;
	}
</style>
