<template>
	<div id="site" ref="site" :class="{ loaded: iframeLoaded }">
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
					v-for="(pin, index) in pins"
					class="pin"
					:type="pin.type"
					:private="pin.private"
					:complete="pin.complete"
					:key="pin.ID"
					:style="pinLocation(pin.element_index, pin.x, pin.y)"
					@mouseover="outline(pin.element_index)"
					@mouseout="removeOutline(pin.element_index)"
				>{{ index + 1 }}</span>
			</div>
			<span
				class="pin cursor"
				:class="{ active: cursorActive }"
				:style="cursorLocation"
			>{{ pins.length + 1 }}</span>
		</div>

		<div class="loading" v-if="!iframeLoaded">
			<div>
				<figure>
					<WaitingIcon />
					<div class="wave">
						<span class="dot"></span>
						<span class="dot"></span>
						<span class="dot"></span>
					</div>
				</figure>
				<p>Please wait a few seconds while we process this.</p>
			</div>
		</div>
	</div>
</template>

<script>
	import WaitingIcon from "~/components/atoms/svg/icon-waiting.svg";

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
		components: {
			WaitingIcon,
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
				pins: [],
				pinsFetching: false,
				pinLocations: {},
				containerX: 0,
				containerY: 0,
				cursorActive: false,
				currentAllowed: 27,
				pinWindowOpen: false,
			};
		},
		created() {
			console.log("CREATED");
		},
		computed: {
			iframe() {
				return document.getElementById("the-page");
			},
			iframeDocument() {
				return (
					this.iframe.contentDocument ||
					this.iframe.contentWindow.document
				);
			},
			iframeLoaded() {
				return this.$store.state.revise.iframeLoaded;
			},
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
			cursorLocation() {
				return (
					"transform: translate(" +
					this.containerX +
					"px, " +
					this.containerY +
					"px);"
				);
			},
		},
		async mounted() {
			console.log("MOUNTED");

			await this.$nextTick(async () => {
				// Check frame scale
				this.calculateScale();

				// Fetch pins
				this.$nuxt.$loading.start();
				await this.fetchPins(this.device.phase_ID, this.$route.params.id);
				setInterval(() => {
					// !!! ONLY CHECK THE MODIFICATION OF PHASE !!!
					//this.fetchPins(this.$route.params.id);
				}, 5000);
			});

			// Check iframe page load
			document.getElementById("the-page").onload = () => {
				console.log("IFRAME LOADED");
				this.$store.commit("revise/setLoaded", true);
				this.runInspector();
			};

			// Resize check
			await window.addEventListener("resize", this.calculateScale);
		},
		methods: {
			async fetchPins(phaseID, deviceID) {
				this.pinsFetching = true;
				await this.$axios
					.get("phase/" + phaseID + "/pins/" + deviceID)
					.then(({ status, data }) => {
						if (status === 200) {
							console.log("PINS: ", data.pins);
							this.pins = data.pins;
							this.pinsFetching = false;
						}
					})
					.catch((error) => {
						console.log("ERROR: ", error);
						this.pinsFetching = false;
					});
			},
			calculateScale() {
				let page = this.$refs.site;
				if (!page) return 1;

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
				if (!this.iframe || !this.iframeDocument) return false;
				let selector = Number.isInteger(element_index)
					? "[data-revisionary-index='" + element_index + "']"
					: element_index;
				let elements = this.iframeDocument.querySelectorAll(selector);
				if (elements.length === 0) {
					return false; // !!! Go parent element...
				}
				return elements;
			},
			getElementOffset(element_index) {
				var selectedElement = this.iframeElement(element_index);
				if (!selectedElement) return false;

				return selectedElement[0].getBoundingClientRect();
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
				if (this.iframeLoaded) this.updatePinsLocations();
				requestAnimationFrame(this.watchElementsPositions);
			},
			applyPinCSS() {
				//console.log("Applying pins CSS...");
				const stylePins = this.pins.filter((pin) => {
					return pin.css !== null;
				});

				stylePins.forEach((pin) => {
					var element_index = pin.element_index;
					var changedElement = this.iframeElement(element_index)[0];
					if (!changedElement) {
						console.log("Skipped because of no element");
						return true;
					}

					var isShowingOriginalStyles =
						changedElement.getAttribute(
							"revisionary-showing-style-changes"
						) === "0";

					// Check if already exists for this pin
					var styleElement = this.iframeElement(
						"style[revisionary-pin-id='" + pin.ID + "']"
					);
					var style = styleElement;

					// Update the CSS
					if (!styleElement.length) {
						style = document.createElement("style");
						style.setAttribute("revisionary-index", element_index);
						style.setAttribute("revisionary-pin-id", pin.ID);
					}

					style.innerHTML =
						'[data-revisionary-index="' +
						element_index +
						'"]{' +
						pin.css +
						"}";

					if (!styleElement.length)
						this.iframeElement("body")[0].appendChild(style);

					// Disable CSS if showing original style
					if (isShowingOriginalStyles) this.disableCSS(pin.ID);
				});
				//console.log("CSS APPLIED: ");
			},
			deleteAllCSS() {
				var elements = this.iframeElement("style[revisionary-pin-id]");
				if (!elements.length) return false;

				Array.prototype.forEach.call(elements, (el, i) => {
					el.parentNode.removeChild(el);
				});
			},
			disableCSS(pin_ID) {
				var element = this.iframeElement(
					'style[revisionary-pin-id="' + pin_ID + '"]'
				);
				if (!element.length) return false;

				return element[0].setAttribute("media", "max-width: 1px;");
			},
			activateCSS(pin_ID) {
				var element = this.iframeElement(
					'style[revisionary-pin-id="' + pin_ID + '"]'
				);
				if (!element.length) return false;

				return element[0].removeAttribute("media");
			},
			applyPinContent() {
				//console.log("Applying pins contents...");
				const contentPins = this.pins.filter((pin) => {
					return pin.modification !== null;
				});

				contentPins.forEach((pin) => {
					var index = pin.element_index;
					var changedElement = this.iframeElement(index)[0];
					if (!changedElement) {
						console.log("Skipped because of no element");
						return true;
					}
					var tag = changedElement.tagName.toUpperCase();

					var isShowingOriginalContent =
						changedElement.getAttribute(
							"revisionary-showing-content-changes"
						) === "0";

					// Apply the change, if it was showing changes
					if (!isShowingOriginalContent) {
						// If the type is HTML content change
						if (pin.modification_type == "html") {
							var newHTML = html_entity_decode(pin.modification);

							// If edited element is a submit or reset input button
							if (
								tag == "INPUT" &&
								(changedElement.getAttribute("type") == "text" ||
									changedElement.getAttribute("type") ==
										"email" ||
									changedElement.getAttribute("type") == "url" ||
									changedElement.getAttribute("type") == "tel" ||
									changedElement.getAttribute("type") ==
										"submit" ||
									changedElement.getAttribute("type") == "reset")
							) {
								changedElement.setAttribute("value", newHTML);
								console.log(
									"Value change for element #",
									index,
									tag,
									newHTML
								);
							} else {
								changedElement.innerHTML = newHTML;
								console.log(
									"Content change for element #",
									index,
									tag,
									newHTML
								);
							}
						} else if (pin.modification_type == "image") {
							var newSrc = pin.modification;

							if (tag == "IMAGE")
								changedElement.setAttribute("xlink:href", newSrc);
							else {
								changedElement.setAttribute("src", newSrc);
								changedElement.removeAttribute("srcset");
								setTimeout(() => {
									changedElement.removeAttribute("srcset");
								}, 1500);
							}

							console.log(
								"Image Update for element #",
								index,
								tag,
								newSrc
							);
						}
					}

					// Add the contenteditable attribute to the live elements
					if (pin.modification_type == "html")
						changedElement.setAttribute(
							"contenteditable",
							isShowingOriginalContent ? "false" : "true"
						);

					// Update info
					changedElement.setAttribute("revisionary-content-edited", "1");
					changedElement.setAttribute(
						"revisionary-showing-content-changes",
						isShowingOriginalContent ? "0" : "1"
					);
				});
				//console.log("CONTENTS APPLIED: ");
			},
			outline(element_index) {
				let element = this.iframeElement(element_index)[0];
				element.setAttribute("revisionary-focused", "");
			},
			removeOutline(element_index) {
				let element = this.iframeElement(element_index)[0];
				element.removeAttribute("revisionary-focused");
			},
			activateCursor() {
				if (!this.iframeLoaded) return false;

				if (!this.currentAllowed) this.cursorActive = false;

				console.log("Activate Cursor");

				// Hide the original cursor
				if (!this.iframeElement("#revisionary-cursor").length) {
					let style = document.createElement("style");
					style.id = "revisionary-cursor";
					style.innerHTML = "* { cursor: crosshair !important; }";
					this.iframeElement("body")[0].appendChild(style);
				}

				this.cursorActive = true;
			},
			deactivateCursor() {
				if (!this.iframeLoaded) return false;

				console.log("Deactivate Cursor");

				// Hide the original cursor
				let cursorUpdater = this.iframeElement("#revisionary-cursor");
				if (cursorUpdater.length) {
					Array.prototype.forEach.call(cursorUpdater, (el, i) => {
						el.parentNode.removeChild(el);
					});
				}

				this.cursorActive = false;
			},
			runInspector() {
				console.log("INSPECTOR RUNNING");

				this.watchElementsPositions();

				// Prevent clicking somewhere
				this.iframeDocument.addEventListener(
					"click",
					(e) => {
						if (this.pinMode != "browse") {
							console.log("MOUSE CLICKED");

							e.stopPropagation();
							e.stopImmediatePropagation();
							e.preventDefault();
							return false;
						}
					},
					true
				);

				// Detect the mouse moves in frame
				this.iframeDocument.addEventListener(
					"mousemove",
					(e) => {
						// Mouse coordinates according to the iframe container
						this.containerX = e.clientX * this.iframeScale;
						this.containerY = e.clientY * this.iframeScale;
						// console.log(
						// 	"Container: ",
						// 	this.containerX,
						// 	this.containerY
						// );

						return;

						// Better unshift detection
						if (
							shifted &&
							shiftToggle &&
							!pinWindowOpen &&
							currentPinType == "browse" &&
							!e.shiftKey
						) {
							shiftToggle = false;
							console.log("UNSHIFTED");

							currentPinType = currentPinTypeWas;
							toggleCursorActive(false, true); // Force Open

							shifted = false;
						}

						// FOCUSING:
						// Focused Element is the mouse pointed element as default
						focused_element = $(e.target);
						reFocus();

						// Work only if cursor is active
						if (cursorActive && !hoveringPin) {
							if (currentPinType == "live") {
								// Live Pin

								// REFOCUS WORKS:
								// Re-focus if the focused element has no index
								if (
									!focused_element_has_index &&
									focused_element.parents(
										"[data-revisionary-index]"
									).length
								) {
									// Re-focus to the closest indexed element
									focused_element = focused_element
										.parents("[data-revisionary-index]")
										.first();
									reFocus();

									//console.log('REFOCUS - if the focused element has no index: ' + focused_element_tagname + '.' + focused_element.attr('class'));
								}

								// Re-focus if only child element has no child and has content: <p><b focused>Lorem ipsum</b></p>
								while (
									focused_element_text == "" && // Focused element has no content
									focused_element_children.length == 1 // Has only one child
									//focused_element_grand_children.length != 0 && // No grand child
									//focused_element_children.first().text().trim() == "" // Grand child should have content
								) {
									// Re-focus to the child element
									focused_element = focused_element_children.first();
									reFocus();

									//console.log(i, 'REFOCUS - Only child element has no child and has content: ' + focused_element_tagname + '.' + focused_element.attr('class'));
								}

								// Re-focus to the edited element if this is child of it: <p data-edited="1" focused><b>Lorem
								if (focused_element_edited_parents.length) {
									// Re-focus to the parent edited element
									focused_element = focused_element_edited_parents.first();
									reFocus();

									//console.log('REFOCUS - Already edited closest parent: ' + focused_element_tagname + '.' + focused_element.attr('class'));
								}

								// EDITABLE CHECKS:
								hoveringText = false;
								focused_element_editable = false;

								// Directly editable:
								// Check element text editable: <p>Lorem ipsum dolor sit amet...
								if (
									easy_html_elements.includes(
										focused_element_tagname
									) && // In easy HTML elements?
									focused_element_text.trim() != "" && // Has to have text
									focused_element.html() != "&nbsp;" && // Text shouldn't be blank
									focused_element_children.length == 0 // No child element
								) {
									hoveringText = true;
									focused_element_editable = true; // Obviously Text Editable
									//console.log( '* Obviously Text Editable: ' + focused_element_tagname + '.' + focused_element.attr('class') );
									//console.log( 'Focused Element Text: ' + focused_element_text );
								}

								// Image editable:
								// Check element image editable: <img src="#">...
								hoveringImage = false;
								if (
									focused_element_tagname == "IMG" ||
									focused_element_tagname == "IMAGE"
								) {
									hoveringImage = true;
									focused_element_editable = true; // Obviously Image Editable
									//console.log( '* Obviously Image Editable: ' + focused_element_tagname + '.' + focused_element.attr('class') );
									//console.log( 'Focused Element Image: ' + focused_element.prop('src') );
								}

								// // Background Image editable: !!!
								// // Check element background image editable
								// if (
								// 	focused_element_tagname != "IMG" && focused_element_tagname != "IMAGE"
								// 	focused_element.css('background-image').substring(0, 4) == "url(" &&
								// 	focused_element.css('background-image').match(/url\(/g).length === 1 // Only one url()
								// ) {

								// 	//focused_element_editable = true; // Obviously Image Editable
								// 	//console.log( '* Obviously Image Editable: ' + focused_element_tagname + '.' + focused_element.attr('class') );
								// 	//console.log( 'Focused Element Image: ' + focused_element.prop('src') );

								// 	//console.log( "BGIMAGE: ", focused_element.css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1') );
								// 	console.log( "BGIMAGE: ", focused_element.css('background-image') );

								// }

								// Check if element has children but doesn't have grand children: <p>Lorem ipsum <a href="#">dolor</a> sit amet...
								if (
									focused_element_children.length > 0 && // Has child
									focused_element_grand_children.length == 0 && // No grand child
									focused_element_text != "" && // Has to have text
									focused_element.html() != "&nbsp;" // Text shouldn't be blank
								) {
									// Also check the children's tagname
									var hardToEdit = true;
									focused_element_children.each(function () {
										// In easy HTML elements?
										if (
											easy_with_br.includes(
												$(this)
													.prop("tagName")
													.toUpperCase()
											)
										)
											hardToEdit = false;
									});

									if (!hardToEdit) {
										hoveringText = true;
										focused_element_editable = true;
										//console.log( '* Text Editable (No Grand Child): ' + focused_element_tagname + '.' + focused_element.attr('class') );
										//console.log( 'Focused Element Text: ' + focused_element_text );
									}
								}

								// Chech if element has only one grand child and it doesn't have any child: <p>Lorem ipsum <a href="#"><strong>dolor</strong></a> sit amet... !!!
								if (
									focused_element_children.length > 0 && // Has child
									focused_element_grand_children.length > 0 && // Has grand child
									focused_element_text.trim() != "" && // And, also have to have text
									focused_element.html() != "&nbsp;" // And, also have to have text
								) {
									// Also check the children's tagname
									var easyToEdit = false;
									focused_element_children.each(function () {
										var child = $(this);
										var grandChildren = child.children();

										if (
											easy_with_br.includes(
												child.prop("tagName").toUpperCase()
											) && // Child is easy to edit
											grandChildren.length == 1 && // Grand child has no more than 1 child !!! ???
											easy_with_br.includes(
												grandChildren
													.first()
													.prop("tagName")
													.toUpperCase()
											) // And that guy is easy to edit as well
										)
											easyToEdit = true;
									});

									if (easyToEdit) {
										hoveringText = true;
										focused_element_editable = true;
										//console.log( '* Text Editable (One Grand Child): ' + focused_element_tagname + '.' + focused_element.attr('class') );
										//console.log( 'Focused Element Text: ' + focused_element_text );
									}
								}

								// Check the submit buttons: <input type="submit | reset">... // !!!
								hoveringButton = false;
								if (
									focused_element_tagname == "INPUT" &&
									(focused_element.attr("type") == "text" ||
										focused_element.attr("type") == "email" ||
										focused_element.attr("type") == "url" ||
										focused_element.attr("type") == "tel" ||
										focused_element.attr("type") == "submit" ||
										focused_element.attr("type") == "reset")
								) {
									hoveringButton = true;
									hoveringText = true;
									focused_element_editable = true; // Obviously Image Editable
									//console.log( '* Button Editable: ' + focused_element_tagname );
									//console.log( 'Focused Button Text: ' + focused_element.attr('value') );
								}

								// PREVENTIONS:
								// Check if it doesn't have any element index: <p data-revisionary-index="16">...
								if (
									focused_element_editable &&
									!focused_element_has_index
								) {
									focused_element_editable = false;
									//console.log( '* Element editable but NO INDEX: ' + focused_element_tagname + '.' + focused_element.attr('class') );
								}

								// If focused element has edited child, don't focus it
								if (focused_element_has_edited_child > 1) {
									focused_element_editable = false;
									//console.log( '* Element editable but there are edited #'+focused_element_has_edited_child+' children: ' + focused_element_tagname + '.' + focused_element.attr('class') );
								}

								// Clean Other Outlines
								removeOutline();

								// Reset the pin opacity
								$("#pins > pin").css("opacity", "");
							} // Live Pin
							else if (currentPinType == "style") {
								// Style Pin

								// Clean Other Outlines
								removeOutline();

								// Reset the pin opacity
								$("#pins > pin").css("opacity", "");
							} // Style Pin
							else if (currentPinType == "comment") {
								// Comment Pin
								// Nothing to do...
							} // Comment Pin

							// // See what am I focusing
							// console.log("###############################");
							// console.log(focused_element.prop('tagName').toUpperCase(), 'Index: ' + focused_element_index );
							// if (focused_element_editable) console.log("ELEMENT EDITABLE");
							// //console.log("CURRENT FOCUSED PIN PRIVATE?: ", focused_element_pin.attr('data-pin-private') );
							// if (hoveringText) console.log("HOVERING ON A TEXT");
							// if (hoveringImage) console.log("HOVERING ON AN IMAGE");
							// if (hoveringButton) console.log("HOVERING ON A BUTTON");
							// console.log("###############################");

							// REACTIONS:
							focused_element_has_live_pin =
								focused_element_live_pin.length;

							// If current element already has a live pin
							if (focused_element_has_live_pin) {
								// Point to the pin
								$(
									'#pins > pin[data-revisionary-index="' +
										focused_element_index +
										'"]'
								).css("opacity", "1");
								$(
									'#pins > pin:not([data-revisionary-index="' +
										focused_element_index +
										'"])'
								).css("opacity", "0.2");

								// Update the cursor
								changePinNumber(focused_element_live_pin.text());

								switchCursorType(
									focused_element_live_pin.attr("data-pin-type"),
									focused_element_live_pin.attr(
										"data-pin-private"
									),
									true
								);
								outline(
									focused_element,
									focused_element_live_pin.attr(
										"data-pin-private"
									),
									focused_element_live_pin.attr("data-pin-type")
								);
								//console.log('This element already has a live pin.');
							} else {
								// UPDATE CURSOR ACCORDING TO PIN MODES (currentPinType: live | style | browse)

								// Re-update the cursor number
								currentPinNumber = $("#pins > pin").length + 1;
								changePinNumber(currentPinNumber);

								// Editable check
								if (currentPinType == "live") {
									switchCursorType(
										focused_element_editable ? "live" : "style"
									);
									if (focused_element_has_index)
										outline(
											focused_element,
											currentPinPrivate,
											focused_element_editable
												? "live"
												: "style"
										);
								} else if (currentPinType == "style") {
									switchCursorType("style");
									if (focused_element_has_index)
										outline(
											focused_element,
											currentPinPrivate,
											"style"
										);
								} else if (currentPinType == "comment") {
									switchCursorType("comment");
								}
							}
						} // If cursor active
					},
					true
				);

				// Add default CSS inside of iframe
				let style = document.createElement("style");
				style.innerHTML = `/* Auto-height edited images */ img[data-revisionary-showing-content-changes="1"] { height: auto !important; } iframe { pointer-events: none !important; } * { -webkit-user-select: none !important; -moz-user-select: none !important; user-select: none !important; } .revisionary-show { position: absolute !important; width: 0 !important; height: 0 !important; display: inline-block !important; } [revisionary-focused] { outline: 2px dashed red; }`;
				this.iframeElement("body")[0].appendChild(style);
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

						// Reset current device CSS
						await this.deleteAllCSS();

						// Fetch pins
						this.$nuxt.$loading.start();
						await this.fetchPins(
							this.device.phase_ID,
							this.$route.params.id
						);

						// Set the loaded true
						this.$store.commit("revise/setLoaded", true);
					});
				}
			},
			pins() {
				console.log("PINS CHANGEEEEEEEEEED");

				this.applyPinCSS();
				this.applyPinContent();
			},
			pinMode(to, from) {
				console.log("Pin Mode Changed", from, to);

				if (to != "browse") this.activateCursor();
				else this.deactivateCursor();
			},
		},
	};

	function get_html_translation_table(table, quote_style) {
		//  discuss at: http://phpjs.org/functions/get_html_translation_table/
		// original by: Philip Peterson
		//  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// bugfixed by: noname
		// bugfixed by: Alex
		// bugfixed by: Marco
		// bugfixed by: madipta
		// bugfixed by: Brett Zamir (http://brett-zamir.me)
		// bugfixed by: T.Wild
		// improved by: KELAN
		// improved by: Brett Zamir (http://brett-zamir.me)
		//    input by: Frank Forte
		//    input by: Ratheous
		//        note: It has been decided that we're not going to add global
		//        note: dependencies to php.js, meaning the constants are not
		//        note: real constants, but strings instead. Integers are also supported if someone
		//        note: chooses to create the constants themselves.
		//   example 1: get_html_translation_table('HTML_SPECIALCHARS');
		//   returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

		var entities = {},
			hash_map = {},
			decimal;
		var constMappingTable = {},
			constMappingQuoteStyle = {};
		var useTable = {},
			useQuoteStyle = {};

		// Translate arguments
		constMappingTable[0] = "HTML_SPECIALCHARS";
		constMappingTable[1] = "HTML_ENTITIES";
		constMappingQuoteStyle[0] = "ENT_NOQUOTES";
		constMappingQuoteStyle[2] = "ENT_COMPAT";
		constMappingQuoteStyle[3] = "ENT_QUOTES";

		useTable = !isNaN(table)
			? constMappingTable[table]
			: table
			? table.toUpperCase()
			: "HTML_SPECIALCHARS";
		useQuoteStyle = !isNaN(quote_style)
			? constMappingQuoteStyle[quote_style]
			: quote_style
			? quote_style.toUpperCase()
			: "ENT_COMPAT";

		if (useTable !== "HTML_SPECIALCHARS" && useTable !== "HTML_ENTITIES") {
			throw new Error("Table: " + useTable + " not supported");
			// return false;
		}

		entities["38"] = "&amp;";
		if (useTable === "HTML_ENTITIES") {
			entities["38"] = "&amp;";
			entities["60"] = "&lt;";
			entities["62"] = "&gt;";
			entities["160"] = "&nbsp;";
			entities["161"] = "&iexcl;";
			entities["162"] = "&cent;";
			entities["163"] = "&pound;";
			entities["164"] = "&curren;";
			entities["165"] = "&yen;";
			entities["166"] = "&brvbar;";
			entities["167"] = "&sect;";
			entities["168"] = "&uml;";
			entities["169"] = "&copy;";
			entities["170"] = "&ordf;";
			entities["171"] = "&laquo;";
			entities["172"] = "&not;";
			entities["173"] = "&shy;";
			entities["174"] = "&reg;";
			entities["175"] = "&macr;";
			entities["176"] = "&deg;";
			entities["177"] = "&plusmn;";
			entities["178"] = "&sup2;";
			entities["179"] = "&sup3;";
			entities["180"] = "&acute;";
			entities["181"] = "&micro;";
			entities["182"] = "&para;";
			entities["183"] = "&middot;";
			entities["184"] = "&cedil;";
			entities["185"] = "&sup1;";
			entities["186"] = "&ordm;";
			entities["187"] = "&raquo;";
			entities["188"] = "&frac14;";
			entities["189"] = "&frac12;";
			entities["190"] = "&frac34;";
			entities["191"] = "&iquest;";
			entities["192"] = "&Agrave;";
			entities["193"] = "&Aacute;";
			entities["194"] = "&Acirc;";
			entities["195"] = "&Atilde;";
			entities["196"] = "&Auml;";
			entities["197"] = "&Aring;";
			entities["198"] = "&AElig;";
			entities["199"] = "&Ccedil;";
			entities["200"] = "&Egrave;";
			entities["201"] = "&Eacute;";
			entities["202"] = "&Ecirc;";
			entities["203"] = "&Euml;";
			entities["204"] = "&Igrave;";
			entities["205"] = "&Iacute;";
			entities["206"] = "&Icirc;";
			entities["207"] = "&Iuml;";
			entities["208"] = "&ETH;";
			entities["209"] = "&Ntilde;";
			entities["210"] = "&Ograve;";
			entities["211"] = "&Oacute;";
			entities["212"] = "&Ocirc;";
			entities["213"] = "&Otilde;";
			entities["214"] = "&Ouml;";
			entities["215"] = "&times;";
			entities["216"] = "&Oslash;";
			entities["217"] = "&Ugrave;";
			entities["218"] = "&Uacute;";
			entities["219"] = "&Ucirc;";
			entities["220"] = "&Uuml;";
			entities["221"] = "&Yacute;";
			entities["222"] = "&THORN;";
			entities["223"] = "&szlig;";
			entities["224"] = "&agrave;";
			entities["225"] = "&aacute;";
			entities["226"] = "&acirc;";
			entities["227"] = "&atilde;";
			entities["228"] = "&auml;";
			entities["229"] = "&aring;";
			entities["230"] = "&aelig;";
			entities["231"] = "&ccedil;";
			entities["232"] = "&egrave;";
			entities["233"] = "&eacute;";
			entities["234"] = "&ecirc;";
			entities["235"] = "&euml;";
			entities["236"] = "&igrave;";
			entities["237"] = "&iacute;";
			entities["238"] = "&icirc;";
			entities["239"] = "&iuml;";
			entities["240"] = "&eth;";
			entities["241"] = "&ntilde;";
			entities["242"] = "&ograve;";
			entities["243"] = "&oacute;";
			entities["244"] = "&ocirc;";
			entities["245"] = "&otilde;";
			entities["246"] = "&ouml;";
			entities["247"] = "&divide;";
			entities["248"] = "&oslash;";
			entities["249"] = "&ugrave;";
			entities["250"] = "&uacute;";
			entities["251"] = "&ucirc;";
			entities["252"] = "&uuml;";
			entities["253"] = "&yacute;";
			entities["254"] = "&thorn;";
			entities["255"] = "&yuml;";
			entities["402"] = "&fnof;";
			entities["913"] = "&Alpha;";
			entities["914"] = "&Beta;";
			entities["915"] = "&Gamma;";
			entities["916"] = "&Delta;";
			entities["917"] = "&Epsilon;";
			entities["918"] = "&Zeta;";
			entities["919"] = "&Eta;";
			entities["920"] = "&Theta;";
			entities["921"] = "&Iota;";
			entities["922"] = "&Kappa;";
			entities["923"] = "&Lambda;";
			entities["924"] = "&Mu;";
			entities["925"] = "&Nu;";
			entities["926"] = "&Xi;";
			entities["927"] = "&Omicron;";
			entities["928"] = "&Pi;";
			entities["929"] = "&Rho;";
			entities["931"] = "&Sigma;";
			entities["932"] = "&Tau;";
			entities["933"] = "&Upsilon;";
			entities["934"] = "&Phi;";
			entities["935"] = "&Chi;";
			entities["936"] = "&Psi;";
			entities["937"] = "&Omega;";
			entities["945"] = "&alpha;";
			entities["946"] = "&beta;";
			entities["947"] = "&gamma;";
			entities["948"] = "&delta;";
			entities["949"] = "&epsilon;";
			entities["950"] = "&zeta;";
			entities["951"] = "&eta;";
			entities["952"] = "&theta;";
			entities["953"] = "&iota;";
			entities["954"] = "&kappa;";
			entities["955"] = "&lambda;";
			entities["956"] = "&mu;";
			entities["957"] = "&nu;";
			entities["958"] = "&xi;";
			entities["959"] = "&omicron;";
			entities["960"] = "&pi;";
			entities["961"] = "&rho;";
			entities["962"] = "&sigmaf;";
			entities["963"] = "&sigma;";
			entities["964"] = "&tau;";
			entities["965"] = "&upsilon;";
			entities["966"] = "&phi;";
			entities["967"] = "&chi;";
			entities["968"] = "&psi;";
			entities["969"] = "&omega;";
			entities["977"] = "&thetasym;";
			entities["978"] = "&upsih;";
			entities["982"] = "&piv;";
			entities["8226"] = "&bull;";
			entities["8230"] = "&hellip;";
			entities["8242"] = "&prime;";
			entities["8243"] = "&Prime;";
			entities["8254"] = "&oline;";
			entities["8260"] = "&frasl;";
			entities["8472"] = "&weierp;";
			entities["8465"] = "&image;";
			entities["8476"] = "&real;";
			entities["8482"] = "&trade;";
			entities["8501"] = "&alefsym;";
			entities["8592"] = "&larr;";
			entities["8593"] = "&uarr;";
			entities["8594"] = "&rarr;";
			entities["8595"] = "&darr;";
			entities["8596"] = "&harr;";
			entities["8629"] = "&crarr;";
			entities["8656"] = "&lArr;";
			entities["8657"] = "&uArr;";
			entities["8658"] = "&rArr;";
			entities["8659"] = "&dArr;";
			entities["8660"] = "&hArr;";
			entities["8704"] = "&forall;";
			entities["8706"] = "&part;";
			entities["8707"] = "&exist;";
			entities["8709"] = "&empty;";
			entities["8711"] = "&nabla;";
			entities["8712"] = "&isin;";
			entities["8713"] = "&notin;";
			entities["8715"] = "&ni;";
			entities["8719"] = "&prod;";
			entities["8721"] = "&sum;";
			entities["8722"] = "&minus;";
			entities["8727"] = "&lowast;";
			entities["8730"] = "&radic;";
			entities["8733"] = "&prop;";
			entities["8734"] = "&infin;";
			entities["8736"] = "&ang;";
			entities["8743"] = "&and;";
			entities["8744"] = "&or;";
			entities["8745"] = "&cap;";
			entities["8746"] = "&cup;";
			entities["8747"] = "&int;";
			entities["8756"] = "&there4;";
			entities["8764"] = "&sim;";
			entities["8773"] = "&cong;";
			entities["8776"] = "&asymp;";
			entities["8800"] = "&ne;";
			entities["8801"] = "&equiv;";
			entities["8804"] = "&le;";
			entities["8805"] = "&ge;";
			entities["8834"] = "&sub;";
			entities["8835"] = "&sup;";
			entities["8836"] = "&nsub;";
			entities["8838"] = "&sube;";
			entities["8839"] = "&supe;";
			entities["8853"] = "&oplus;";
			entities["8855"] = "&otimes;";
			entities["8869"] = "&perp;";
			entities["8901"] = "&sdot;";
			entities["8968"] = "&lceil;";
			entities["8969"] = "&rceil;";
			entities["8970"] = "&lfloor;";
			entities["8971"] = "&rfloor;";
			entities["9001"] = "&lang;";
			entities["9002"] = "&rang;";
			entities["9674"] = "&loz;";
			entities["9824"] = "&spades;";
			entities["9827"] = "&clubs;";
			entities["9829"] = "&hearts;";
			entities["9830"] = "&diams;";
			entities["338"] = "&OElig;";
			entities["339"] = "&oelig;";
			entities["352"] = "&Scaron;";
			entities["353"] = "&scaron;";
			entities["376"] = "&Yuml;";
			entities["710"] = "&circ;";
			entities["732"] = "&tilde;";
			entities["8194"] = "&ensp;";
			entities["8195"] = "&emsp;";
			entities["8201"] = "&thinsp;";
			entities["8204"] = "&zwnj;";
			entities["8205"] = "&zwj;";
			entities["8206"] = "&lrm;";
			entities["8207"] = "&rlm;";
			entities["8211"] = "&ndash;";
			entities["8212"] = "&mdash;";
			entities["8216"] = "&lsquo;";
			entities["8217"] = "&rsquo;";
			entities["8218"] = "&sbquo;";
			entities["8220"] = "&ldquo;";
			entities["8221"] = "&rdquo;";
			entities["8222"] = "&bdquo;";
			entities["8224"] = "&dagger;";
			entities["8225"] = "&Dagger;";
			entities["8240"] = "&permil;";
			entities["8249"] = "&lsaquo;";
			entities["8250"] = "&rsaquo;";
			entities["8364"] = "&euro;";
		}

		if (useQuoteStyle !== "ENT_NOQUOTES") {
			entities["34"] = "&quot;";
		}
		if (useQuoteStyle === "ENT_QUOTES") {
			entities["39"] = "&#39;";
		}

		// ascii decimals to real symbols
		for (decimal in entities) {
			if (entities.hasOwnProperty(decimal)) {
				hash_map[String.fromCharCode(decimal)] = entities[decimal];
			}
		}

		return hash_map;
	}

	function htmlentities(string, quote_style, charset, double_encode) {
		//  discuss at: http://phpjs.org/functions/htmlentities/
		// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		//  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		//  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// improved by: nobbler
		// improved by: Jack
		// improved by: Rafał Kukawski (http://blog.kukawski.pl)
		// improved by: Dj (http://phpjs.org/functions/htmlentities:425#comment_134018)
		// bugfixed by: Onno Marsman
		// bugfixed by: Brett Zamir (http://brett-zamir.me)
		//    input by: Ratheous
		//  depends on: get_html_translation_table
		//        note: function is compatible with PHP 5.2 and older
		//   example 1: htmlentities('Kevin & van Zonneveld');
		//   returns 1: 'Kevin &amp; van Zonneveld'
		//   example 2: htmlentities("foo'bar","ENT_QUOTES");
		//   returns 2: 'foo&#039;bar'

		var hash_map = this.get_html_translation_table(
				"HTML_ENTITIES",
				quote_style
			),
			symbol = "";

		string = string == null ? "" : string + "";

		if (!hash_map) {
			return false;
		}

		if (quote_style && quote_style === "ENT_QUOTES") {
			hash_map["'"] = "&#039;";
		}

		double_encode = double_encode == null || !!double_encode;

		var regex = new RegExp(
			"&(?:#\\d+|#x[\\da-f]+|[a-zA-Z][\\da-z]*);|[" +
				Object.keys(hash_map)
					.join("")
					// replace regexp special chars
					.replace(/([()[\]{}\-.*+?^$|\/\\])/g, "\\$1") +
				"]",
			"g"
		);

		return string.replace(regex, function (ent) {
			if (ent.length > 1) {
				return double_encode ? hash_map["&"] + ent.substr(1) : ent;
			}

			return hash_map[ent];
		});
	}

	function html_entity_decode(string, quote_style) {
		//  discuss at: http://phpjs.org/functions/html_entity_decode/
		// original by: john (http://www.jd-tech.net)
		//    input by: ger
		//    input by: Ratheous
		//    input by: Nick Kolosov (http://sammy.ru)
		// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// improved by: marc andreu
		//  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		//  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// bugfixed by: Onno Marsman
		// bugfixed by: Brett Zamir (http://brett-zamir.me)
		// bugfixed by: Fox
		//  depends on: get_html_translation_table
		//   example 1: html_entity_decode('Kevin &amp; van Zonneveld');
		//   returns 1: 'Kevin & van Zonneveld'
		//   example 2: html_entity_decode('&amp;lt;');
		//   returns 2: '&lt;'

		var hash_map = {},
			symbol = "",
			tmp_str = "",
			entity = "";
		tmp_str = string.toString();

		if (
			false ===
			(hash_map = get_html_translation_table("HTML_ENTITIES", quote_style))
		) {
			return false;
		}

		// fix &amp; problem
		// http://phpjs.org/functions/get_html_translation_table:416#comment_97660
		delete hash_map["&"];
		hash_map["&"] = "&amp;";

		for (symbol in hash_map) {
			entity = hash_map[symbol];
			tmp_str = tmp_str.split(entity).join(symbol);
		}
		tmp_str = tmp_str.split("&#039;").join("'");

		return tmp_str;
	}
</script>

<style lang="scss">
	#site {
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		position: relative;

		.iframe-container {
			width: 100%;
			height: 100%;
			outline: 2px solid $color-primary;
			background-color: white;
			position: relative;
			overflow: hidden;

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

		&:not(.loaded) .iframe-container {
			outline: none;
		}

		.loading {
			position: absolute;
			z-index: 5;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: white;
			display: grid;
			place-items: center;
			color: $color-raven;

			& > div {
				text-align: center;

				& > figure {
					width: 90px;
					height: 90px;
					position: relative;
					margin: 0 auto 30px;

					& > svg {
						display: block;
					}

					.wave {
						display: block;
						width: 100%;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);

						.dot {
							display: inline-block;
							width: 10px;
							height: 10px;
							border-radius: 50%;
							margin-right: 3px;
							background: white;
							animation: wave 1.2s linear infinite;

							&:nth-child(2) {
								animation-delay: -1.1s;
							}

							&:nth-child(3) {
								animation-delay: -0.9s;
							}
						}
					}

					@keyframes wave {
						0%,
						60%,
						100% {
							transform: initial;
						}

						30% {
							transform: translateY(-15px);
						}
					}
				}
			}
		}
	}
</style>
