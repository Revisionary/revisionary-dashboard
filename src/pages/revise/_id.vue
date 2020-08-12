<template>
	<div id="site" ref="site">
		<div
			class="iframe-container"
			ref="iframeContainer"
			:style="'width: ' + iframeWidth + 'px; height: '+ iframeHeight + 'px;'"
		>
			<iframe
				:src="device.phase_url"
				sandbox="allow-same-origin allow-scripts"
				id="the-page"
				name="the-page"
				scrolling="auto"
				:width="deviceWidth"
				:height="deviceHeight"
				:style="'min-width: '+deviceWidth+'px; min-height: '+deviceHeight+'px; transform: scale(' + iframeScale + ');'"
			></iframe>
			<div id="pins">
				<span
					class="pin"
					v-for="(pin, index) in pins"
					:key="pin.ID"
					:style="'transform: translate('+pin.pin_x+'px, '+pin.pin_y+'px);'"
					@mouseover="iframeElement(pin.pin_element_index).style.opacity = '0.2'"
				>{{ index + 1 }}</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		layout: "app",
		async validate({ params, store }) {
			console.log("VALIDATE");

			// Fetch the device data
			await store.dispatch("device/fetch", params.id);

			// If device found
			if (store.getters["device/get"].ID == params.id) return true;

			// If device not found
			return false;
		},
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
		created() {
			console.log("CREATED");

			// Fetch pins
			this.$nextTick(() => {
				this.$nuxt.$loading.start();
				this.$store.dispatch("device/fetchPins", this.$route.params.id);
			});
		},
		computed: {
			device() {
				return this.$store.getters["device/get"];
			},
			deviceWidth() {
				return this.device.width
					? this.device.width
					: this.device.screen_width;
			},
			deviceHeight() {
				return this.device.height
					? this.device.height
					: this.device.screen_height;
			},
			iframeScale() {
				return this.$store.state.device.iframeScale;
			},
			iframeWidth() {
				return this.deviceWidth * this.iframeScale;
			},
			iframeHeight() {
				return this.deviceHeight * this.iframeScale;
			},
			pins() {
				return this.$store.getters["device/getPins"];
			},
		},
		mounted() {
			console.log("MOUNTED");

			this.$nextTick(() => {
				this.calculateScale();
			});

			window.addEventListener("resize", this.calculateScale);
		},
		watch: {
			$route(to, from) {
				// console.log("FROM: ", from);
				// console.log("TO: ", to);

				if (from.params.id != to.params.id) {
					this.$nextTick(() => {
						this.calculateScale();
					});
				}
			},
		},
		methods: {
			calculateScale() {
				let page = this.$refs.site;
				let width = page.clientWidth - 4; // -4 for the borders
				let height = page.clientHeight - 4; // -4 for the borders

				// Early exit if smaller than the screen
				let iframeScale = Math.min(
					width / this.deviceWidth,
					height / this.deviceHeight
				);
				if (width >= this.deviceWidth && height >= this.deviceHeight)
					iframeScale = 1;

				this.$store.commit("device/setScale", iframeScale);
				console.log("SCALE: ", iframeScale, width, height);
			},
			iframeElement(elementIndex) {
				let iframe = document.getElementById("the-page");
				let doc = iframe.contentDocument || iframe.contentWindow.document;
				return doc.querySelector(
					"[data-revisionary-index='" + elementIndex + "']"
				);
			},
			pinLocation(ID) {},
		},
	};
</script>

<style lang="scss">
	#site {
		display: flex;
		justify-content: center;
		align-items: center;

		.iframe-container {
			width: 100%;
			height: 100%;
			outline: 2px solid red;
			background-color: white;
			position: relative;

			iframe {
				border: none;
				transform-origin: top left;

				&.dragging {
					pointer-events: none;
				}
			}

			/* PINS */
			#pins {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				pointer-events: none;

				& > .pin {
					position: absolute;
					pointer-events: auto;
					cursor: pointer;
					left: 0;
					top: 0;

					&:hover {
						opacity: 0.5;
					}
				}
			}
		}
	}
</style>
