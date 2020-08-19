<template>
	<div id="site" ref="site">
		<div
			class="iframe-container"
			:class="{ loaded: loaded }"
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
					v-for="(pin, index) in pins"
					class="pin"
					:type="pin.type"
					:private="pin.private"
					:key="pin.ID"
					:style="pinLocation(pin.element_index, pin.x, pin.y)"
				>{{ index + 1 }}</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		async validate({ params, store }) {
			console.log("VALIDATE");

			// Fetch the device data
			await store.dispatch("revise/fetch", params.id);

			// If device found
			if (store.getters["revise/get"].ID == params.id) return true;

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
		data() {
			return {
				loaded: false,
				pins: [],
				pinsFetching: false,
				pinLocations: {},
			};
		},
		created() {
			console.log("CREATED");
		},
		computed: {
			device() {
				return this.$store.getters["revise/get"];
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
				return this.$store.state.revise.iframeScale;
			},
			iframeWidth() {
				return this.deviceWidth * this.iframeScale;
			},
			iframeHeight() {
				return this.deviceHeight * this.iframeScale;
			},
			pinMode() {
				return this.$store.state.revise.pinMode;
			},
		},
		async mounted() {
			console.log("MOUNTED");

			await this.$nextTick(async () => {
				// Check frame scale
				this.calculateScale();

				// Fetch pins
				this.$nuxt.$loading.start();
				await this.fetchPins(this.$route.params.id);
			});

			// Check iframe page load
			document.getElementById("the-page").onload = () => {
				console.log("IFRAME LOADED");
				this.loaded = true;
				this.runInspector();
			};

			// Resize check
			await window.addEventListener("resize", this.calculateScale);
		},
		methods: {
			async fetchPins(deviceID) {
				this.pinsFetching = true;
				await this.$axios
					.get("device/" + deviceID + "/pins")
					.then(({ status, data }) => {
						if (status === 200) {
							console.log("PINS: ", data.pins);
							this.pins = data.pins;
							this.pinsFetching = false;
						}
					})
					.catch(function (error) {
						console.log("ERROR: ", error);
						this.pinsFetching = false;
					});
			},
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

				this.$store.commit("revise/setScale", iframeScale);
				console.log("SCALE: ", iframeScale, width, height);
			},
			iframeElement(element_index) {
				let iframe = document.getElementById("the-page");
				if (!iframe) return false;
				let doc = iframe.contentDocument || iframe.contentWindow.document;
				let elements = doc.querySelectorAll(
					"[data-revisionary-index='" + element_index + "']"
				);
				if (elements.length === 0 || elements.length > 1) {
					return false; // !!! Go parent element...
				}
				return elements[0];
			},
			getElementOffset(element_index) {
				var selectedElement = this.iframeElement(element_index);
				if (!selectedElement) return false;

				return selectedElement.getBoundingClientRect();
			},
			pinLocation(element_index, pin_x, pin_y) {
				// Check the cache first
				var elementOffset = this.pinLocations[element_index];
				if (typeof elementOffset === "undefined") {
					elementOffset = this.getElementOffset(element_index);
					//console.log("NOT FOUND: ", elementOffset);
				}
				if (!elementOffset) return false;

				var elementTop = elementOffset.top;
				var elementLeft = elementOffset.left;
				var elementWidth = elementOffset.width;
				var elementHeight = elementOffset.height;

				var page = this.$refs.site;
				var width = page.clientWidth - 4; // -4 for the borders
				var height = page.clientHeight - 4; // -4 for the borders
				var iframeScale = this.$store.state.revise.iframeScale;
				var pinSize = 30; // !!!!!!

				// Detect the X positive exceed
				if (elementLeft + parseFloat(pin_x) > width / iframeScale)
					pin_x = elementWidth;

				// Detect the X negative exceed
				if (elementLeft + parseFloat(pin_x) < 0) pin_x = 0;

				// The coordinates by the element
				var elementPinX = elementLeft + parseFloat(pin_x);
				var elementPinY = elementTop + parseFloat(pin_y);

				// With the iframe scale
				elementPinX = parseFloat(elementPinX) * iframeScale;
				elementPinY = parseFloat(elementPinY) * iframeScale;

				// Middle of the pin
				elementPinX = elementPinX - pinSize / 2;
				elementPinY = elementPinY - pinSize / 2;

				return (
					"transform: translate(" +
					elementPinX +
					"px, " +
					elementPinY +
					"px);"
				);
			},
			updatePinsLocations() {
				//console.log("Locations updating...");
				this.pins.forEach((pin) => {
					var index = pin.element_index;
					var elementOffsetData = this.getElementOffset(index);
					if (!elementOffsetData) return true;

					const elementOffset = {
						left: elementOffsetData.left,
						top: elementOffsetData.top,
						width: elementOffsetData.width,
						height: elementOffsetData.height,
					};

					this.$set(this.pinLocations, index, elementOffset);
				});
				//console.log("Locations Updated: ", this.pinLocations);
			},
			watchElementsPositions() {
				if (this.loaded) this.updatePinsLocations();
				requestAnimationFrame(this.watchElementsPositions);
			},
			runInspector() {
				console.log("INSPECTOR RUNNING");

				this.watchElementsPositions();
			},
		},
		watch: {
			async $route(to, from) {
				// console.log("FROM: ", from);
				// console.log("TO: ", to);

				if (from.params.id != to.params.id) {
					await this.$nextTick(async () => {
						// Check frame scale
						this.calculateScale();

						// Fetch pins
						this.$nuxt.$loading.start();
						await this.fetchPins(this.$route.params.id);

						// Set the loaded true
						this.loaded = true;
					});
				}
			},
		},
	};
</script>

<style lang="scss">
	#site {
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;

		.iframe-container {
			width: 100%;
			height: 100%;
			outline: 2px solid red;
			background-color: white;
			position: relative;
			opacity: 0.2;

			&.loaded {
				opacity: 1;
			}

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
