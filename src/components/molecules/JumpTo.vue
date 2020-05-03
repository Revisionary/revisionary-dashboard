<template>
	<div class="selectbox jump-to">
		<a href="#">Jump to...</a>
		<CaretDownIcon />
	</div>
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
		position: relative;
		margin-left: 120px;

		& > svg {
			position: absolute;
			right: 12px;
			top: 50%;
		}

		&:hover {
			color: #037ef3;

			& > svg path {
				fill: #037ef3;
			}
		}
	}
</style>
