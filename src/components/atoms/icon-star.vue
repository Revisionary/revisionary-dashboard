<template>
	<svg
		width="15"
		height="14"
		viewBox="0 0 15 14"
		:fill="active ? '#F3D432' : 'none'"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M7.5 1L9.5085 5.069L14 5.7255L10.75 8.891L11.517 13.363L7.5 11.2505L3.483 13.363L4.25 8.891L1 5.7255L5.4915 5.069L7.5 1Z"
			:stroke="active ? '#CFB21A' : 'black'"
			stroke-opacity="0.26"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</template>
<style>
</style>
<script>
	export default {
		props: {
			active: {
				default: false
			}
		}
	};
</script>
