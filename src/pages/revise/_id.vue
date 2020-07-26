<template>
	<div id="site" ref="site">
		<div
			class="iframe-container"
			ref="iframeContainer"
			:style="'width: ' + iframeWidth + 'px; height: '+ iframeHeight + 'px;'"
		>
			<iframe
				:src="device.phase_url"
				ref="iframe"
				sandbox="allow-same-origin allow-scripts"
				id="the-page"
				name="the-page"
				scrolling="auto"
				:width="device.width"
				:height="device.height"
				:style="'min-width: '+device.width+'px; min-height: '+device.height+'px; transform: scale(' + iframeScale + ');'"
			></iframe>
		</div>
	</div>
</template>

<script>
	export default {
		layout: "app",
		components: {},
		head() {
			return {
				title:
					//this.iframeScale.toFixed(1) +
					"Revise Page: " +
					this.device.page_name +
					" - " +
					this.device.project_name +
					"",
			};
		},
		data() {
			return {
				iframeScale: 1,
				iframeWidth: 0,
				iframeHeight: 0,
			};
		},
		created() {
			// this.$nextTick(() => {
			// 	this.$nuxt.$loading.start();
			// });
			// FETCH PINS HERE !!!
		},
		computed: {
			device() {
				return this.$store.getters["device/get"];
			},
		},
		mounted() {
			this.$nextTick(() => {
				this.onResize();
			});
			window.addEventListener("resize", this.onResize);

			this.iframeWidth = this.device.width;
			this.iframeHeight = this.device.height;
		},
		methods: {
			onResize() {
				let iframe = this.$refs.iframe;

				let maxWidth = this.device.width;
				let maxHeight = this.device.height;

				let page = this.$refs.site;
				let width = page.clientWidth;
				let height = page.clientHeight - 2;

				// IFRAME FIT TO THE SCREEN
				width = width - 4; // -4 for the borders
				height = height - 2; // -2 for the borders

				// Early exit if smaller than the screen
				if (width >= maxWidth && height >= maxHeight) {
					this.iframeScale = 1;
					return;
				}

				this.iframeScale = Math.min(width / maxWidth, height / maxHeight);
				this.iframeWidth = maxWidth * this.iframeScale;
				this.iframeHeight = maxHeight * this.iframeScale;
			},
		},
	};
</script>

<style lang="scss">
	#site {
		display: grid;
		place-items: center;
		height: 100%;

		.iframe-container {
			display: flex;
			justify-content: center;
			align-items: center;
			height: calc(100% - 60px - 4px);
			width: calc(100% - 4px);
			outline: 2px solid red;
			background-color: white;

			iframe {
				border: none;
				max-width: 100%;
				max-height: 100%;

				&.dragging {
					pointer-events: none;
				}
			}
		}
	}
</style>
