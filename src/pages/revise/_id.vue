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
					:style="'transform: translate('+locationsByElement(pin.pin_element_index, pin.pin_x, pin.pin_y).x+'px, '+locationsByElement(pin.pin_element_index, pin.pin_x, pin.pin_y).y+'px);'"
					@mouseover="testing(pin.pin_element_index, pin.pin_x, pin.pin_y)"
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
			testing(index, x, y) {
				console.log(
					"locationsByElement: ",
					this.locationsByElement(index, x, y)
				);
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

				this.$store.commit("device/setScale", iframeScale);
				console.log("SCALE: ", iframeScale, width, height);
			},
			iframeElement(element_index) {
				let iframe = document.getElementById("the-page");
				let doc = iframe.contentDocument || iframe.contentWindow.document;
				return doc.querySelector(
					"[data-revisionary-index='" + element_index + "']"
				);
			},
			getElementOffset(element_index, noScroll = false) {
				var selectedElement = this.iframeElement(element_index);
				if (selectedElement === null) return false;

				//console.log('ELEMENT OFFSET: ', selectedElement.offset() );
				//console.log('VISIBILITY: ', selectedElement.is(':visible') );

				// // Check if hidden
				// if (selectedElement.style.display == "none") {
				// 	var pin = getPin(element_index, true);
				// 	if (!pin) return false;
				// 	var pin_ID = pin.pin_ID;

				// 	// Check the cache first
				// 	if (hiddenElementOffsets[element_index] === undefined) {
				// 		// Disabled temporarily
				// 		disableCSS(pin_ID);
				// 		selectedElement.addClass("revisionary-show");

				// 		hiddenElementOffsets[
				// 			element_index
				// 		] = selectedElement.offset();

				// 		selectedElement.removeClass("revisionary-show");
				// 		activateCSS(pin_ID);
				// 	}

				// 	var elementLeft =
				// 		hiddenElementOffsets[element_index].left -
				// 		scrollX / iframeScale;
				// 	var elementTop =
				// 		hiddenElementOffsets[element_index].top -
				// 		scrollY / iframeScale;

				// 	console.log(
				// 		"Hidden element #" + element_index,
				// 		hiddenElementOffsets[element_index]
				// 	);
				// 	return {
				// 		top: elementTop,
				// 		left: elementLeft,
				// 	};
				// }

				// // If not on the screen
				// else if (selectedElement.is(":hidden")) {
				// 	// Temporary location
				// 	var parentElement = selectedElement.parents(":visible");
				// 	var parentOffset = noScroll
				// 		? parentElement.offset()
				// 		: parentElement[0].getBoundingClientRect();
				// 	parentOffset.top =
				// 		parentOffset.top + parentElement.height() - 25;
				// 	parentOffset.left = parentOffset.left + 25;

				// 	console.log("Invisible Element #", element_index);
				// 	return parentOffset;
				// }

				//console.log('2. Element Offset for element #' + element_index, selectedElement.offset());
				return noScroll
					? selectedElement.offset()
					: selectedElement.getBoundingClientRect();
			},
			locationsByElement(element_index, pin_x, pin_y, noScroll = false) {
				// Update the location and size values
				//updateLocationValues();

				var elementOffset = this.getElementOffset(element_index, noScroll);
				if (!elementOffset) return false;

				var elementTop = elementOffset.top;
				var elementLeft = elementOffset.left;
				var elementWidth = elementOffset.width;
				var elementHeight = elementOffset.height;

				var page = this.$refs.site;
				var width = page.clientWidth - 4; // -4 for the borders
				var height = page.clientHeight - 4; // -4 for the borders
				var iframeScale = this.$store.state.device.iframeScale;
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

				// // Scroll
				// if (!noScroll) {

				// 	elementPinX = elementPinX - scrollX;
				// 	elementPinY = elementPinY - scrollY;

				// }

				return {
					x: elementPinX,
					y: elementPinY,
				};
			},
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
