<template>
	<span
		class="status"
		:class="{
			compact: compact,
			done: incompletedCount == 0,
			notask: incompletedCount == 0 && completedCount == 0
		}"
	></span>
</template>

<script>
	export default {
		props: {
			completedCount: {
				required: true
			},
			incompletedCount: {
				required: true
			},
			compact: {
				default: true
			}
		}
	};
</script>

<style lang="scss">
	.status {
		width: 8px;
		height: 8px;
		box-sizing: content-box;
		border-radius: 50%;
		pointer-events: none;
		transition: 500ms;
		background-color: #f39754;
		border: 3px solid transparentize(#f39754, 0.5);
		background-clip: padding-box;

		&.compact {
			pointer-events: all;
			width: 5px;
			height: 5px;
			border-width: 1px;
			margin-right: 10px;
		}

		&.done {
			background-color: #7fcd74;
			border-color: transparentize(#7fcd74, 0.5);
		}

		&.notask {
			background-color: transparent;
			border-color: transparentize(grey, 0.7);
		}
	}
</style>
