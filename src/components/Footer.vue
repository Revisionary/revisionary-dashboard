<template>
	<footer>
		<div class="container">
			<div class="left-side">REVISIONARY DASHBOARD</div>
			<div class="right-side">COPYRIGHT © 2020 REVISIONARY</div>
		</div>
	</footer>
</template>
<style lang="scss">
	footer {
		position: absolute;
		right: 0;
		bottom: 0;
		width: calc(100% - 188px);
		padding: 0 55px;

		& > .container {
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-top: 1px solid #dce1ea;
			padding: 20px;
			color: #a6aaba;
			font-weight: 400;
			font-size: 12px;
			line-height: 14px;
			letter-spacing: 0.1px;
		}

		.sidebarClosed & {
			width: 100%;
		}
	}
</style>
