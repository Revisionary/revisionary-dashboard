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
					v-for="(pin, index) in Pins"
					class="pin"
					:type="pin.type"
					:private="pin.private"
					:complete="pin.complete"
					:key="pin.ID"
					:id="pin.ID"
					:index="pin.element_index"
					:style="pinLocation(pin.element_index, pin.x, pin.y)"
					@mouseover="pinHover(pin)"
					@mouseout="pinUnHover(pin)"
				>{{ index + 1 }}</span>
			</div>
			<span
				class="pin cursor"
				:type="currentCursorType"
				:private="currentCursorPrivate"
				:class="{ active: cursorActive && currentCursorType != 'browse' && !cursorHidden && !hoveringPin, existing: cursorExisting }"
				:style="cursorLocation"
			>{{ currentPinNumber }}</span>
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
					"Revise Page: " +
					this.device.page_name +
					" - " +
					this.device.project_name,
			};
		},
		data() {
			return {
				page_type: "url",
				page_redirected: false,
				page_colors: {},
				colorsSorted: [],

				// HTML Element Index
				easy_html_elements: [
					"A",
					"B",
					"I",
					"U",
					"EM",
					"STRONG",
					"STRIKE",
					"SMALL",
					"TEXTAREA",
					"LABEL",
					"BUTTON",
					"TIME",
					"DATE",
					"ADDRESS",
					"BLOCKQUOTE",
					"P",
					"DIV",
					"SPAN",
					"LI",
					"H1",
					"H2",
					"H3",
					"H4",
					"H5",
					"H6",
					"TH",
					"TD",
				],

				// Focused Element
				iframe: null,
				focused_element: null,
				focused_element_editable: false,

				// Pins
				Pins: [],
				pinLocations: {},
				pinsFetching: false,
				pinDragging: false,
				autoRefreshInterval: 5000,
				autoRefreshRequest: null,
				pinsListOpen: false,
				commentsGetRequest: null,
				removePinProcess: [],
				openPin: null,
				hiddenElementOffsets: {},
				pinSize: 35,

				// Pin Window
				pinWindowOpen: false,
				pinWindowWasOpen: false,
				pinWindowWidth: 350,
				pinWindowHeight: 515,
				selectionFromContentEditor: false,

				// Pin Mode
				pinModes: {
					live: "Content and View Changes",
					style: "View Changes",
					comment: "Comment",
					"private-live": "Private Content and View Changes",
					private: "Private View Changes",
					browse: "Browse Mode",
				},

				currentPinTypeWas: 0,
				currentPinPrivateWas: 0,
				currentPinNumber: 1,

				// Cursor
				cursorActive: false,
				cursorWasActive: false,
				currentCursorType: "style",
				currentCursorPrivate: 0,
				cursorHidden: false,
				cursorExisting: false,

				shifted: false,
				shiftToggle: false,

				// Mouse
				offset: {},
				containerX: 0,
				containerY: 0,

				// Hovers
				hoveringText: false,
				hoveringImage: false,
				hoveringButton: false,
				hoveringPin: false,
				focusedPin: null,

				// Scrolls
				scrollOffset_top: 0,
				scrollOffset_left: 0,
				oldScrollOffset_top: 0,
				oldScrollOffset_left: 0,
				scrollX: 0,
				scrollY: 0,
				scrollOnPin: false,

				// Limitations
				currentAllowed: 27,
				currentLimitLabel: "",
			};
		},
		created() {
			console.log("CREATED");
		},
		computed: {
			// IFRAME VARIABLES
			iframeSelector() {
				return $("#the-page");
			},
			childWindow() {
				return this.iframeSelector.prop("contentWindow");
			},
			iframeDocument() {
				return this.childWindow.document;
			},
			iframeLoaded() {
				return this.$store.state.revise.iframeLoaded;
			},
			user_ID() {
				return this.$auth.user.ID;
			},

			// DEVICE SIZES
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

			easy_with_br() {
				return [...this.easy_html_elements, "BR", "IMG", "SVG", "PATH"];
			},

			// CURSOR ACTIONS
			currentPinType: {
				get: function () {
					return this.$store.state.revise.currentPinType;
				},
				set: function (newValue) {
					this.$store.commit("revise/setCurrentPinType", newValue);
				},
			},
			currentPinPrivate: {
				get: function () {
					return this.$store.state.revise.currentPinPrivate;
				},
				set: function (newValue) {
					this.$store.commit("revise/setCurrentPinPrivate", newValue);
				},
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
			//currentCursorType() {},

			// Focus Variables
			focused_element_index() {
				if (!this.focused_element) return 0;
				return this.focused_element.attr("data-revisionary-index");
			},
			focused_element_has_index() {
				return this.focused_element_index != null;
			},
			focused_element_text() {
				return this.focused_element
					.clone()
					.children()
					.remove()
					.end()
					.text()
					.trim(); // Gives only text, without inner html
			},
			focused_element_html() {
				return this.focused_element.html();
			},
			focused_element_children() {
				return this.focused_element.children();
			},
			focused_element_grand_children() {
				return this.focused_element_children.children();
			},
			focused_element_pin() {
				return pinElement(this.focused_element_index, true);
			},
			focused_element_live_pin() {
				return $(
					'#pins > .pin[type="live"][index="' +
						this.focused_element_index +
						'"]'
				);
			},
			focused_element_has_live_pin() {
				return this.focused_element_live_pin.length;
			},
			focused_element_edited_parents() {
				return this.focused_element.parents(
					"[data-revisionary-index][data-revisionary-content-edited]"
				);
			},
			focused_element_has_edited_child() {
				return this.focused_element.find(
					"[data-revisionary-index][data-revisionary-content-edited]"
				).length;
			},
			focused_element_tagname() {
				return this.focused_element.prop("tagName").toUpperCase();
			},

			// pinMode() {
			// 	return this.$store.state.revise.currentPinType;
			// },
		},
		async mounted() {
			console.log("MOUNTED");

			await this.$nextTick(async () => {
				// Check frame scale
				this.calculateScale();
			});

			// Resize check
			await window.addEventListener("resize", this.calculateScale);

			// Run the inspector
			await this.runTheInspector();
		},
		methods: {
			async fetchPins(phaseID, deviceID) {
				this.pinsFetching = true;
				await this.$axios
					.get("phase/" + phaseID + "/pins/" + deviceID)
					.then(({ status, data }) => {
						if (status === 200) {
							console.log("PINS: ", data.pins);
							this.Pins = data.pins;
							this.pinsFetching = false;
							this.currentPinNumber = this.Pins.length + 1;
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

			// Initiate the inspector
			runTheInspector() {
				console.log("INSPECTOR RUNNING");

				this.watchElementsPositions();

				// // WHEN IFRAME DOCUMENT READY !!! ?
				// this.iframe.ready(function () {
				// 	console.log("IFRAME DOCUMENT READY!");
				// });

				// WHEN IFRAME HAS LOADED
				this.iframeSelector.on("load", () => {
					console.log(
						"IFRAME DOCUMENT LOADED!",
						canAccessIFrame(this.iframeSelector)
					);

					// If we have access on this iframe (CORS Check)
					if (canAccessIFrame(this.iframeSelector)) {
						// Iframe element
						this.iframe = this.iframeSelector.contents();
						this.$store.commit("revise/setLoaded", true);

						// After coming back to the real page
						if (this.page_redirected) {
							console.log("LOAD PAGE REOPENED");
							this.page_redirected = false;

							setTimeout(() => {
								// Does not work sometimes, and needs improvement !!!

								this.iframe.scrollTop(this.oldScrollOffset_top);
								this.iframe.scrollLeft(this.oldScrollOffset_left);
								this.oldScrollOffset_top = this.oldScrollOffset_left = 0;

								// Show the pins
								$("#pins").css("opacity", "");

								// Remove the overlay
								$("#wait").hide();

								console.log(
									"LOAD PAGE REOPEN COMPLETE",
									this.page_redirected
								);
							}, 2000);
						} else {
							// UPDATE INITIAL CURSOR TYPE

							// Check for the client settings
							var clientPinType = get_client_cache(
								this.user_ID + "_currentPinType"
							);
							var clientPinPrivate = get_client_cache(
								this.user_ID + "_currentPinPrivate"
							);

							// From last option
							if (clientPinType != null && clientPinPrivate != null) {
								this.currentPinType = clientPinType;
								this.currentPinPrivate = clientPinPrivate;

								if (
									this.page_type == "url" &&
									clientPinType == "comment"
								)
									this.currentPinType = "live";
							}

							// From URL
							if (getParameterByName("pinmode") == "style") {
								this.currentPinType = "style";
								this.currentPinPrivate = 0;
							}

							if (getParameterByName("pinmode") == "comment") {
								this.currentPinType = "comment";
								this.currentPinPrivate = 0;
							}

							if (getParameterByName("pinmode") == "browse") {
								this.currentPinType = "browse";
								this.currentPinPrivate = 0;
							}

							// Update the pin type
							this.switchPinType(
								this.currentPinType,
								this.currentPinPrivate
							);

							// PINS:
							// Get latest pins and apply them to the page
							this.$nuxt.$loading.start();
							this.fetchPins(
								this.device.phase_ID,
								this.$route.params.id
							);
							this.openPin = null;
						}

						// IFRAME EVENTS:
						var doChangeOnPage = {};
						var mouseDownOnContentEdit = false;
						var scrollTimer,
							scrollFlag = false;

						// Prevent clicking somewhere
						this.iframeDocument.addEventListener(
							"click",
							(e) => {
								if (this.currentPinType != "browse") {
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
								//console.log('Container: ', containerX, containerY);

								// Better unshift detection
								if (
									this.shifted &&
									this.shiftToggle &&
									!this.pinWindowOpen &&
									this.currentPinType == "browse" &&
									!e.shiftKey
								) {
									this.shiftToggle = false;
									console.log("UNSHIFTED");

									this.switchPinType(
										this.currentPinTypeWas,
										this.currentPinPrivateWas
									);

									this.shifted = false;
								}

								// FOCUSING:
								// Focused Element is the mouse pointed element as default
								this.focused_element = $(e.target);

								// Work only if cursor is active
								if (this.cursorActive && !this.hoveringPin) {
									// Live Pin Focus Updates
									if (this.currentPinType == "live") {
										// REFOCUS WORKS:
										// Re-focus if the focused element has no index
										if (
											!this.focused_element_has_index &&
											this.focused_element.parents(
												"[data-revisionary-index]"
											).length
										) {
											// Re-focus to the closest indexed element
											this.focused_element = this.focused_element
												.parents("[data-revisionary-index]")
												.first();

											//console.log('REFOCUS - if the focused element has no index: ' + focused_element_tagname + '.' + focused_element.attr('class'));
										}

										// Re-focus if only child element has no child and has content: <p><b focused>Lorem ipsum</b></p>
										while (
											this.focused_element_text == "" && // Focused element has no content
											this.focused_element_children.length ==
												1 // Has only one child
											//focused_element_grand_children.length != 0 && // No grand child
											//focused_element_children.first().text().trim() == "" // Grand child should have content
										) {
											// Re-focus to the child element
											this.focused_element = this.focused_element_children.first();

											//console.log(i, 'REFOCUS - Only child element has no child and has content: ' + focused_element_tagname + '.' + focused_element.attr('class'));
										}

										// Re-focus to the edited element if this is child of it: <p data-edited="1" focused><b>Lorem
										if (
											this.focused_element_edited_parents
												.length
										) {
											// Re-focus to the parent edited element
											this.focused_element = this.focused_element_edited_parents.first();

											//console.log('REFOCUS - Already edited closest parent: ' + focused_element_tagname + '.' + focused_element.attr('class'));
										}

										// EDITABLE CHECKS:
										this.hoveringText = false;
										this.focused_element_editable = false;

										// Directly editable:
										// Check element text editable: <p>Lorem ipsum dolor sit amet...
										if (
											this.easy_html_elements.includes(
												this.focused_element_tagname
											) && // In easy HTML elements?
											this.focused_element_text.trim() !=
												"" && // Has to have text
											this.focused_element.html() !=
												"&nbsp;" && // Text shouldn't be blank
											this.focused_element_children.length ==
												0 // No child element
										) {
											this.hoveringText = true;
											this.focused_element_editable = true; // Obviously Text Editable
											//console.log( '* Obviously Text Editable: ' + focused_element_tagname + '.' + focused_element.attr('class') );
											//console.log( 'Focused Element Text: ' + focused_element_text );
										}

										// Image editable:
										// Check element image editable: <img src="#">...
										this.hoveringImage = false;
										if (
											this.focused_element_tagname == "IMG" ||
											this.focused_element_tagname == "IMAGE"
										) {
											this.hoveringImage = true;
											this.focused_element_editable = true; // Obviously Image Editable
											//console.log( '* Obviously Image Editable: ' + focused_element_tagname + '.' + focused_element.attr('class') );
											//console.log( 'Focused Element Image: ' + focused_element.prop('src') );
										}

										// // Background Image editable: !!!
										// // Check element background image editable
										// if (
										// 	this.focused_element_tagname != "IMG" && this.focused_element_tagname != "IMAGE"
										// 	this.focused_element.css('background-image').substring(0, 4) == "url(" &&
										// 	this.focused_element.css('background-image').match(/url\(/g).length === 1 // Only one url()
										// ) {

										// 	//this.focused_element_editable = true; // Obviously Image Editable
										// 	//console.log( '* Obviously Image Editable: ' + focused_element_tagname + '.' + focused_element.attr('class') );
										// 	//console.log( 'Focused Element Image: ' + focused_element.prop('src') );

										// 	//console.log( "BGIMAGE: ", focused_element.css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1') );
										// 	console.log( "BGIMAGE: ", focused_element.css('background-image') );

										// }

										// Check if element has children but doesn't have grand children: <p>Lorem ipsum <a href="#">dolor</a> sit amet...
										if (
											this.focused_element_children.length >
												0 && // Has child
											this.focused_element_grand_children
												.length == 0 && // No grand child
											this.focused_element_text != "" && // Has to have text
											this.focused_element.html() != "&nbsp;" // Text shouldn't be blank
										) {
											// Also check the children's tagname
											var hardToEdit = true;
											this.focused_element_children.each(
												(item) => {
													// In easy HTML elements?
													if (
														this.easy_with_br.includes(
															$(item)
																.prop("tagName")
																.toUpperCase()
														)
													)
														hardToEdit = false;
												}
											);

											if (!hardToEdit) {
												this.hoveringText = true;
												this.focused_element_editable = true;
												//console.log( '* Text Editable (No Grand Child): ' + focused_element_tagname + '.' + focused_element.attr('class') );
												//console.log( 'Focused Element Text: ' + focused_element_text );
											}
										}

										// Chech if element has only one grand child and it doesn't have any child: <p>Lorem ipsum <a href="#"><strong>dolor</strong></a> sit amet... !!!
										if (
											this.focused_element_children.length >
												0 && // Has child
											this.focused_element_grand_children
												.length > 0 && // Has grand child
											this.focused_element_text.trim() !=
												"" && // And, also have to have text
											this.focused_element.html() != "&nbsp;" // And, also have to have text
										) {
											// Also check the children's tagname
											var easyToEdit = false;
											this.focused_element_children.each(
												function () {
													var child = $(this);
													var grandChildren = child.children();

													if (
														this.easy_with_br.includes(
															child
																.prop("tagName")
																.toUpperCase()
														) && // Child is easy to edit
														grandChildren.length == 1 && // Grand child has no more than 1 child !!! ???
														this.easy_with_br.includes(
															grandChildren
																.first()
																.prop("tagName")
																.toUpperCase()
														) // And that guy is easy to edit as well
													)
														easyToEdit = true;
												}
											);

											if (easyToEdit) {
												this.hoveringText = true;
												this.focused_element_editable = true;
												//console.log( '* Text Editable (One Grand Child): ' + focused_element_tagname + '.' + focused_element.attr('class') );
												//console.log( 'Focused Element Text: ' + focused_element_text );
											}
										}

										// Check the submit buttons: <input type="submit | reset">... // !!!
										this.hoveringButton = false;
										if (
											this.focused_element_tagname ==
												"INPUT" &&
											(this.focused_element.attr("type") ==
												"text" ||
												this.focused_element.attr("type") ==
													"email" ||
												this.focused_element.attr("type") ==
													"url" ||
												this.focused_element.attr("type") ==
													"tel" ||
												this.focused_element.attr("type") ==
													"submit" ||
												this.focused_element.attr("type") ==
													"reset")
										) {
											this.hoveringButton = true;
											this.hoveringText = true;
											this.focused_element_editable = true; // Obviously Image Editable
											//console.log( '* Button Editable: ' + focused_element_tagname );
											//console.log( 'Focused Button Text: ' + focused_element.attr('value') );
										}

										// PREVENTIONS:
										// Check if it doesn't have any element index: <p data-revisionary-index="16">...
										if (
											this.focused_element_editable &&
											!this.focused_element_has_index
										) {
											this.focused_element_editable = false;
											//console.log( '* Element editable but NO INDEX: ' + focused_element_tagname + '.' + focused_element.attr('class') );
										}

										// If focused element has edited child, don't focus it
										if (
											this.focused_element_has_edited_child >
											1
										) {
											this.focused_element_editable = false;
											//console.log( '* Element editable but there are edited #'+focused_element_has_edited_child+' children: ' + focused_element_tagname + '.' + focused_element.attr('class') );
										}
									} // Live Pin

									// Clean Other Outlines
									this.removeOutline();

									// Reset the pin opacity
									$("#pins > .pin").css("opacity", "");

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

									// If current element already has a live pin
									if (this.focused_element_has_live_pin) {
										// Point to the pin
										this.focused_element_live_pin.css(
											"opacity",
											"1"
										);
										$(
											'#pins > .pin:not([index="' +
												this.focused_element_index +
												'"])'
										).css("opacity", "0.2");

										// Update the cursor
										this.currentPinNumber = this.focused_element_live_pin.text();

										// Update cursor type
										this.switchCursorType(
											this.focused_element_live_pin.attr(
												"type"
											),
											this.focused_element_live_pin.attr(
												"private"
											),
											true
										);

										// Outline
										this.outline(
											this.focused_element,
											this.focused_element_live_pin.attr(
												"type"
											),
											this.focused_element_live_pin.attr(
												"private"
											)
										);

										//console.log('This element already has a live pin.');
									} else {
										// UPDATE CURSOR ACCORDING TO PIN MODES (currentPinType: live | style | browse)

										// Re-update the cursor number
										this.currentPinNumber =
											this.Pins.length + 1;

										// Update Cursor Type
										this.switchCursorType(
											this.currentPinType,
											this.currentPinPrivate,
											this.currentPinType == "live"
												? !this.focused_element_editable
												: false
										);

										// Outline
										if (this.focused_element_has_index) {
											if (
												(this.currentPinType == "live" &&
													this
														.focused_element_editable) ||
												this.currentPinType == "style"
											) {
												this.outline(
													this.focused_element,
													this.currentPinType,
													this.currentPinPrivate
												);
											}
										}
									}
								} // If cursor active
							},
							true
						);

						// Detect the mouse clicks in frame
						this.iframeDocument.addEventListener(
							"mousedown",
							(e) => {
								//console.log('MOUSE DOWN');

								// While editing a content on page
								mouseDownOnContentEdit =
									this.cursorActive &&
									this.focused_element_has_live_pin;

								//$('#the-page').css('pointer-events', 'none');
							},
							true
						);

						// Detect the mouse clicks in frame
						this.iframeDocument.addEventListener(
							"mouseup",
							(e) => {
								// var code = e.keyCode || e.which;
								// console.log('KEYCODE: ', code, e.type);

								//console.log('MOUSE CLICKED SOMEWHERE', focused_element_index);

								// If cursor is active
								if (this.cursorActive) {
									// If focused element has a live pin
									if (this.focused_element_has_live_pin) {
										// Open the new pin window if already open one or clicking an image editable
										if (
											this.pinWindowOpen ||
											this.focused_element_pin.attr(
												"data-pin-modification-type"
											) == "image" ||
											this.focused_element.attr(
												"data-revisionary-showing-content-changes"
											) == "0"
										)
											openPinWindow(
												this.focused_element_pin.attr(
													"data-pin-id"
												)
											);
									} else {
										// Add a pin and open a pin window
										if (!mouseDownOnContentEdit)
											putPin(
												this.focused_element_index,
												e.pageX,
												e.pageY,
												this.currentCursorType,
												this.currentPinPrivate
											);
									}
								} else {
									// Close the pin window if open and not cursor active and not content editable
									if (
										this.pinWindowOpen &&
										!this.iframeElement(
											this.focused_element_index
										).is("[contenteditable]") &&
										!this.shifted &&
										!this.selectionFromContentEditor
									)
										closePinWindow(true);
								}

								selectionFromContentEditor = false;

								// Re-enable iframe
								//$('#the-page').css('pointer-events', '');

								// Prevent clicking something
								e.preventDefault();
								e.stopImmediatePropagation();
								e.stopPropagation();
								return false;
							},
							true
						);

						// Detect the scroll to re-position pins
						this.iframeDocument.addEventListener(
							"scroll",
							(e) => {
								//console.log('SCROLLIIIIIIIING');

								// Add scrolling class to the body
								if (!scrollFlag) {
									scrollFlag = true;
									$("body").addClass("scrolling");
								}
								clearTimeout(scrollTimer);
								scrollTimer = setTimeout(function () {
									$("body").removeClass("scrolling");
									scrollFlag = false;
								}, 200);

								// Re-Locate all the pins !!! Performance issues
								//relocatePins();
							},
							true
						);

						var shiftedCallBack = (e) => {
							if (e.shiftKey) this.shifted = true;

							if (
								this.shifted &&
								!this.pinWindowOpen &&
								this.currentPinType != "browse"
							) {
								this.shiftToggle = true;
								console.log("SHIFTED");

								this.switchPinType("browse");
							}

							// Escape
							if (e.keyCode == 27 && this.pinWindowOpen) {
								console.log("CLOSE PIN WINDOW via ESC");
								this.closePinWindow();

								e.preventDefault();
								return false;
							}
						};

						var unShiftedCallBack = (e) => {
							if (
								this.shifted &&
								this.shiftToggle &&
								!this.pinWindowOpen &&
								this.currentPinType == "browse"
							) {
								this.shiftToggle = false;
								console.log("UNSHIFTED");

								this.switchPinType(
									this.currentPinTypeWas,
									this.currentPinPrivateWas
								);
							}

							this.shifted = false;
						};

						// Detect shift key press to toggle browse mode
						this.iframeDocument.addEventListener(
							"keydown",
							shiftedCallBack,
							true
						);

						// Detect shift key press to toggle browse mode
						this.iframeDocument.addEventListener(
							"keyup",
							unShiftedCallBack,
							true
						);

						// REDIRECT DETECTION
						$(this.iframeDocument).ready(() => {
							$(this.childWindow).on("beforeunload", () => {
								// Prevent leaving the page
								if (processExists) return true;

								console.log("REDIRECTING DETECTED...");
								this.$store.commit("revise/setLoaded", false);

								// If pin window open
								if (this.pinWindowOpen) {
									// Register the open pin
									this.openPin = pinWindow().attr("data-pin-id");
									console.log(
										"AFTER REDIRECT, OPEN PIN ID #" + openPin
									);

									// Close pin window
									this.closePinWindow(false);
								}

								// Stop Autorefresh
								stopAutoRefresh();

								$("#wait").show();

								// Hide the pins
								$("#pins").css("opacity", "0");

								oldScrollOffset_top = scrollOffset_top;
								oldScrollOffset_left = scrollOffset_left;

								return;
							});
						});
					} else {
						// IF NO ACCESS OF IFRAME

						console.log("*** LOAD REDIRECTING BACK TO...", page_URL);

						//window.frames["the-page"].location = page_URL;
						$("#the-page").attr("src", page_URL);
						this.page_redirected = true;
						this.$store.commit("revise/setLoaded", false);

						return;
					}

					console.log(
						"Load Complete",
						canAccessIFrame(this.iframeSelector)
					);

					// SITE STYLES
					this.iframeElement("body").append(
						' \
		<style> \
			/* Auto-height edited images */ \
			img[data-revisionary-showing-content-changes="1"] { height: auto !important; } \
			iframe { pointer-events: none !important; } \
			* { -webkit-user-select: none !important; -moz-user-select: none !important; user-select: none !important; } \
			.revisionary-show { position: absolute !important; width: 0 !important; height: 0 !important; display: inline-block !important; } \
		</style> \
		'
					);

					// If new downloaded site, ask whether or not it's showing correctly
					if ($(".ask-showing-correctly").length)
						$(".ask-showing-correctly").addClass("open");

					// MOUSE ACTIONS:
					this.iframe
						.on(
							"input",
							'[contenteditable="true"][data-revisionary-index]',
							(e) => {
								// Detect changes on page text

								var element_index = $(this).attr(
									"data-revisionary-index"
								);
								var pin_ID = pinElement(
									'[data-pin-type="live"][data-revisionary-index="' +
										element_index +
										'"]'
								).attr("data-pin-id");
								var changedElement = $(this);
								var modification = changedElement.html();

								// If edited element is a submit or reset input button
								if (
									changedElement.prop("tagName").toUpperCase() ==
										"INPUT" &&
									(changedElement.attr("type") == "text" ||
										changedElement.attr("type") == "email" ||
										changedElement.attr("type") == "url" ||
										changedElement.attr("type") == "tel" ||
										changedElement.attr("type") == "submit" ||
										changedElement.attr("type") == "reset")
								) {
									modification = changedElement.val();
								}

								//console.log('REGISTERED CHANGES', modification);

								// Stop the auto-refresh
								stopAutoRefresh();

								// Update the element, pin and pin window status
								updateAttributes(
									pin_ID,
									"data-revisionary-content-edited",
									"1"
								);
								updateAttributes(
									pin_ID,
									"data-revisionary-showing-content-changes",
									"1"
								);

								// Instant apply the change on pin window
								pinWindow(pin_ID)
									.find(".content-editor .edit-content.changes")
									.html(modification);

								// If differences tab is open
								if (
									pinWindow(pin_ID).hasClass("show-differences")
								) {
									var originalContent = pinWindow(pin_ID)
										.find(
											".content-editor .edit-content.original"
										)
										.html();
									var changedContent = pinWindow(pin_ID)
										.find(
											".content-editor .edit-content.changes"
										)
										.html();

									// Difference check
									var diffContent = diffCheck(
										originalContent,
										changedContent
									);

									// Add the differences content
									pinWindow(pin_ID)
										.find(
											".content-editor .edit-content.differences"
										)
										.html(diffContent);
								}

								// Remove unsent job
								if (doChangeOnPage[element_index])
									clearTimeout(doChangeOnPage[element_index]);

								// Send changes to DB after 1 second
								doChangeOnPage[element_index] = setTimeout(
									function () {
										saveChange(pin_ID, modification);
									},
									1000
								);

								//console.log('Content changed.');
							}
						)
						.on(
							"focus",
							'[contenteditable="true"][data-revisionary-index]',
							(e) => {
								// When clicked an editable text

								// Remove all the other focus outlines
								this.iframeElement(
									".revisionary-focused"
								).removeClass("revisionary-focused");
								this.removeOutline();

								// Outline this focused element
								this.outline(
									this.focused_element,
									this.focused_element_live_pin.attr(
										"data-pin-private"
									)
								);
								this.focused_element.addClass(
									"revisionary-focused"
								);

								// Open the new pin window if already open
								if (
									this.pinWindowOpen &&
									this.focused_element_live_pin != null &&
									this.focused_element_has_live_pin &&
									pinWindow().attr("data-revisionary-index") !=
										this.focused_element_index
								)
									openPinWindow(
										this.focused_element_live_pin.attr(
											"data-pin-id"
										)
									);
							}
						)
						.on(
							"blur",
							'[contenteditable="true"][data-revisionary-index]',
							(e) => {
								// When clicked an editable text

								this.iframeElement(
									".revisionary-focused"
								).removeClass("revisionary-focused");
								this.removeOutline();
							}
						)
						.on("paste", "[contenteditable]", (e) => {
							// When pasting rich text

							e.preventDefault();

							var plain_text = (
								e.originalEvent || e
							).clipboardData.getData("text/plain");

							if (typeof plain_text !== "undefined")
								document
									.getElementById("the-page")
									.contentWindow.document.execCommand(
										"insertText",
										false,
										plain_text
									);

							console.log("PASTED: ", plain_text);
						})
						.on("click", "a[href]", (e) => {
							// Click to browse on pages

							var link = $(this).attr("href");
							var absoluteLink = urlStandardize($(this).prop("href"));

							// Record the clicked link
							if (
								this.currentPinType == "browse" &&
								!link.startsWith("#") &&
								!link.startsWith("javascript:") // jshint ignore:line
							) {
								// New page link
								var newPageLink =
									"/projects/?add_new=true&screens[]=" +
									screen_ID +
									"&page_width=" +
									page_width +
									"&page_height=" +
									page_height +
									"&project_ID=" +
									project_ID +
									"&page-url=" +
									encodeURIComponent(absoluteLink);

								// console.log(newPageLink);
								// e.preventDefault();
								// e.stopPropagation();
								// return false;

								// Search in my pages registered
								var pageFound = myPages.find(function (page) {
									return (
										urlStandardize(page.page_url, true) ==
											urlStandardize(absoluteLink, true) &&
										page.project_ID == project_ID
									);
								});

								// If the page has already been downloaded, go revising that page
								if (pageFound) {
									// Prevent clicking same page URL
									if (pageFound.page_ID == page_ID) {
										alert(
											"You are currently editing this page."
										);

										e.preventDefault();
										e.stopPropagation();
										return false;
									}

									newPageLink =
										"/page/" +
										pageFound.page_ID +
										"?screen=" +
										screen_ID +
										"&page_width=" +
										page_width +
										"&page_height=" +
										page_height;
									console.log(
										"ALREADY DOWNLOADED!!!",
										newPageLink
									);
								}

								// Prevent adding a new page if no allowed page
								if (this.currentAllowed == "0" && !pageFound) {
									// Open the limit modal
									openModal("limit-warning");

									e.preventDefault();
									e.stopPropagation();
									return false;
								}

								// Remove current page if no pins added
								if (
									queryParameter(currentUrl(), "new") == "page" &&
									Pins.length == 0
								) {
									// Remove the page and then go to the link
									doAction(
										"remove",
										"page",
										page_ID,
										"redirect",
										newPageLink
									);
								} else {
									// Redirect
									window.open(newPageLink, "_self");
								}

								e.preventDefault();
								e.stopPropagation();
								return false;
							}
						});

					// PAGE EVENTS
					// Detect the window resizing to re-position pins ???
					window.addEventListener("resize", (e) => {
						//console.log('RESIZIIIIIIIING');

						// Add scrolling class to the body
						if (!scrollFlag) {
							scrollFlag = true;
							$("body").addClass("scrolling");
						}
						clearTimeout(scrollTimer);
						scrollTimer = setTimeout(function () {
							$("body").removeClass("scrolling");
							scrollFlag = false;
						}, 200);
					});

					// Detect cursor moves from outside of iframe
					window.addEventListener("mousemove", (e) => {
						// Iframe offset
						this.offset = $("#the-page").offset();

						this.containerX = e.clientX - this.offset.left;
						this.containerY = e.clientY - this.offset.top;

						//console.log(hoveringPin);
					});

					// Keyboard bindings
					document.addEventListener("keydown", shiftedCallBack);
					document.addEventListener("keyup", unShiftedCallBack);

					// Focus to the iframe
					this.iframeSelector.focus();
				});
			},

			// Detect colors in the page
			detectColors() {
				//console.log('Colors are being detected in the page...');

				this.iframeElement("body *").each((item) => {
					var color = $(item).css("color");
					if (color.indexOf("a") == -1)
						color = color.replace(")", ", 1)").replace("rgb", "rgba");
					if (color == "rgba(0, 0, 0, 1)") color = "rgba(0, 0, 0, 0)"; // Reduce whites

					var bgColor = $(item).css("background-color");
					if (bgColor.indexOf("a") == -1)
						bgColor = bgColor
							.replace(")", ", 1)")
							.replace("rgb", "rgba");
					if (bgColor == "rgba(0, 0, 0, 1)") bgColor = "rgba(0, 0, 0, 0)"; // Reduce whites

					var colorCount = parseInt(this.page_colors[color]) || 0;
					this.page_colors[color] = colorCount + 1;

					var bgColorCount = parseInt(this.page_colors[bgColor]) || 0;
					this.page_colors[bgColor] = bgColorCount + 1;
				});

				// Order the colors
				this.colorsSorted = Object.keys(page_colors).sort(function (a, b) {
					return page_colors[b] - page_colors[a];
				});
				$("input[type='color']").spectrum(
					"option",
					"palette",
					colorsSorted
				);

				console.log("Color detection complete.", colorsSorted);
			},

			// OUTLINES:
			// Color the element
			outline(element, pin_type, private_pin) {
				if (!this.iframeLoaded) return false;
				if ($.isNumeric(element)) element = this.iframeElement(element);
				if (!element.length) return false;

				// Default
				var elementColor = "red";
				if (pin_type == "live") elementColor = "#74B65C";
				if (pin_type == "style") elementColor = "#F39754";
				if (pin_type == "comment") elementColor = "#0363F3";
				if (private_pin == 1) elementColor = "#D16262";

				element.css("outline", "2px dashed " + elementColor, "important");
			},

			// Color the element
			removeOutline() {
				if (!this.iframeLoaded) return false;

				// Remove outlines from iframe
				this.iframeElement("*:not(.revisionary-focused)").css(
					"outline",
					""
				);
			},

			// CURSOR:

			// PinType Update
			pinTypeUpdate(
				pinType = this.currentPinType,
				pinPrivate = this.currentPinPrivate
			) {
				// Image mode
				if (
					(this.page_type == "image" || this.page_type == "capture") &&
					(pinType == "live" || pinType == "style")
				) {
					pinType = "comment";
				}

				// Change the cursor color (By default, existing mark if live)
				this.switchCursorType(pinType, pinPrivate, pinType == "live");

				// URL update
				if (history.pushState) {
					var newurl = queryParameter(
						currentUrl(),
						"pinmode",
						this.currentPinType == "live" ? "" : this.currentPinType
					);
					newurl = queryParameter(
						newurl,
						"privatepin",
						this.currentPinPrivate == 1 ? "1" : ""
					);
					window.history.pushState({ path: newurl }, "", newurl);
				}

				// Client settings
				set_client_cache(
					this.user_ID + "_currentPinType",
					this.currentPinType
				);
				set_client_cache(
					this.user_ID + "_currentPinPrivate",
					this.currentPinPrivate
				);

				// Close the pin window
				if (this.pinWindowOpen && this.iframeLoaded) this.closePinWindow();

				// Pin limitation popup
				if (this.currentAllowed == "0") {
					// Open the modal
					//this.openModal("limit-warning");
				}
			},

			// Switch to a different pin mode
			switchPinType(
				pinType = this.currentPinType,
				pinPrivate = this.currentPinPrivate
			) {
				console.log(
					"Switch Pin Type: " + pinType,
					"Private: " + pinPrivate
				);

				// Image mode
				if (
					(this.page_type == "image" || this.page_type == "capture") &&
					(pinType == "live" || pinType == "style")
				) {
					pinType = "comment";
				}

				this.currentPinTypeWas = this.currentPinType;
				this.currentPinPrivateWas = this.currentPinPrivate;
				this.currentPinType = pinType;
				this.currentPinPrivate = pinPrivate;
			},

			// Switch to a different cursor mode
			switchCursorType(
				cursorType = this.currentPinTypeWas,
				cursorPrivate = this.currentPinPrivateWas,
				cursorExisting = false
			) {
				//console.log("New Cursor Type: ", cursorType, "Private: " + pinPrivate);

				// Update cursor
				this.currentCursorType = cursorType;
				this.currentCursorPrivate = cursorPrivate;
				this.cursorExisting = cursorExisting;

				// Cursor Activation
				if (this.currentCursorType != "browse" && !this.cursorActive)
					this.activateCursor();

				if (this.currentCursorType == "browse" && this.cursorActive)
					this.deactivateCursor();

				// Remove outlines from iframe
				this.removeOutline();
			},

			// Activate Cursor
			activateCursor() {
				if (!this.iframeLoaded) return false;

				// If hit the limitations
				if (this.currentAllowed == 0) {
					console.log("Could not activate the cursor, hit the limit");
					this.deactivateCursor();
					return false;
				}

				console.log("Activate Cursor");

				// Show the cursor
				this.cursorActive = true;

				// Hide the original cursor
				if (!this.iframeElement("#revisionary-cursor").length)
					this.iframeElement("body").append(
						'<style id="revisionary-cursor"> * { cursor: crosshair !important; } </style>'
					);
			},

			// Deactivate Cursor
			deactivateCursor() {
				if (!this.iframeLoaded) return false;

				console.log("Deactivate Cursor");

				// Hide the cursor
				this.cursorActive = false;
				this.focused_element = null;

				// Show the original cursor
				this.iframeElement("#revisionary-cursor").remove();
			},

			// Get element offset
			getElementOffset(element_index, noScroll = false) {
				var selectedElement = this.iframeElement(element_index);
				if (!selectedElement.length) {
					//console.log("Iframe element not found.", element_index);
					return false;
				}

				//console.log("ELEMENT OFFSET: ", selectedElement.offset());
				//console.log('VISIBILITY: ', selectedElement.is(':visible') );

				// Check if hidden
				if (selectedElement.css("display") == "none") {
					var pin = this.getPin(element_index, true);
					if (!pin) return false;
					var pin_ID = pin.pin_ID;

					// Check the cache first
					if (this.hiddenElementOffsets[element_index] === undefined) {
						// Disabled temporarily
						this.disableCSS(pin_ID);
						selectedElement.addClass("revisionary-show");

						this.hiddenElementOffsets[
							element_index
						] = selectedElement.offset();

						selectedElement.removeClass("revisionary-show");
						this.activateCSS(pin_ID);
					}

					var elementLeft =
						hiddenElementOffsets[element_index].left -
						scrollX / iframeScale;
					var elementTop =
						hiddenElementOffsets[element_index].top -
						scrollY / iframeScale;

					console.log(
						"Hidden element #" + element_index,
						hiddenElementOffsets[element_index]
					);
					return {
						top: elementTop,
						left: elementLeft,
					};
				}

				// If not on the screen
				else if (selectedElement.is(":hidden")) {
					// Temporary location
					var parentElement = selectedElement.parents(":visible").first();
					if (!parentElement.length) return false;
					var parentOffset = noScroll
						? parentElement.offset()
						: parentElement[0].getBoundingClientRect();
					parentOffset.top =
						parentOffset.top + parentElement.height() - 25;
					parentOffset.left = parentOffset.left + 25;

					console.log("Invisible Element #", element_index);
					return parentOffset;
				}

				//console.log('2. Element Offset for element #' + element_index, selectedElement.offset());
				return noScroll
					? selectedElement.offset()
					: selectedElement[0].getBoundingClientRect();
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
				this.Pins.forEach((pin) => {
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

			applyChanges() {
				this.Pins.forEach((pin) => {
					if (pin.modification !== null) this.updateChange(pin);
					if (pin.css != null) this.updateCSS(pin);
				});
			},

			// CONTENT
			// Update a modification
			updateChange(pin, modification, applyHTML = true) {
				if (!pin) return false;

				var changedElement = this.iframeElement(pin.element_index);
				if (!changedElement) return false;

				modification =
					typeof modification !== "undefined"
						? modification
						: pin.modification;

				console.log("Update Change of ", pin.element_index, modification);

				if (modification == null || modification == "{%null%}") {
					//this.revertChange(pin);
				} else {
					var isShowingOriginalContent = changedElement.is(
						'[revisionary-showing-content-changes="0"]'
					);

					// Apply the change, if it was showing changes
					if (!isShowingOriginalContent) {
						// If the type is HTML content change
						if (pin.modification_type == "html") {
							//console.log('MODIFICATION ORIG:', pin.pin_modification);

							// Apply the change
							var newHTML = html_entity_decode(modification);
							if (applyHTML) changedElement.html(newHTML);

							// If edited element is a submit or reset input button
							if (
								changedElement.prop("tagName").toUpperCase() ==
									"INPUT" &&
								(changedElement.attr("type") == "text" ||
									changedElement.attr("type") == "email" ||
									changedElement.attr("type") == "url" ||
									changedElement.attr("type") == "tel" ||
									changedElement.attr("type") == "submit" ||
									changedElement.attr("type") == "reset")
							) {
								changedElement.val(newHTML);
							}

							//console.log('MODIFICATION DECODED:', newHTML);

							// If the type is image change
						} else if (pin.modification_type == "image") {
							// Apply the change
							var newSrc = modification; //console.log('NEW', newHTML);

							if (
								changedElement.prop("tagName").toUpperCase() ==
								"IMAGE"
							)
								changedElement.attr("xlink:href", newSrc);
							else
								changedElement
									.attr("src", newSrc)
									.removeAttr("srcset");
						}
					}

					// Add the contenteditable attribute to the live elements
					if (pin.modification_type == "html")
						changedElement.attr(
							"contenteditable",
							isShowingOriginalContent ? "false" : "true"
						);

					// Update info
					changedElement.attr("data-revisionary-content-edited", "1");
					changedElement.attr(
						"data-revisionary-showing-content-changes",
						isShowingOriginalContent ? "0" : "1"
					);
				}
			},

			// CSS
			// Update CSS
			updateCSS(pin, cssCode) {
				if (!pin) return false;

				var element_index = pin.element_index;
				var changedElement = this.iframeElement(element_index);
				if (!changedElement) return false;

				cssCode = typeof cssCode !== "undefined" ? cssCode : pin.css;

				// Remove changed marks if null
				if (cssCode == null) {
					//this.revertCSS(pin_ID);
				} else {
					var isShowingOriginalStyles = changedElement.is(
						'[revisionary-showing-style-changes="no"]'
					);

					// Mark the old one
					this.iframeElement(
						'style[data-pin-id="' + pin.ID + '"]'
					).addClass("old");

					// Add the new CSS codes
					this.iframeElement("body").append(
						'<style data-index="' +
							element_index +
							'" data-pin-id="' +
							pin.ID +
							'">[data-revisionary-index="' +
							element_index +
							'"]{' +
							cssCode +
							"}</style>"
					);

					// Remove the old ones
					this.iframeElement(
						'style.old[data-pin-id="' + pin.ID + '"]'
					).remove();

					// Disable CSS if showing original style
					if (isShowingOriginalStyles) this.disableCSS(pin.ID);

					// Update the info for pin, pin window and DOM element
					changedElement.attr("data-revisionary-style-changed", "yes");
					changedElement.attr(
						"data-revisionary-showing-style-changes",
						isShowingOriginalStyles ? "no" : "yes"
					);
				}
			},
			disableCSS(pin_ID) {
				return this.iframeElement(
					'style[data-pin-id="' + pin.pin_ID + '"]'
				).attr("media", "max-width: 1px;");
			},
			activateCSS(pin_ID) {
				return iframeElement(
					'style[data-pin-id="' + pin.pin_ID + '"]'
				).removeAttr("media");
			},

			deleteAllCSS() {
				var elements = this.iframeElement("style[revisionary-pin-id]");
				if (!elements.length) return false;

				Array.prototype.forEach.call(elements, (el, i) => {
					el.parentNode.removeChild(el);
				});
			},

			// SELECTORS:
			// Find iframe element
			iframeElement(selector) {
				if (!this.iframeLoaded) {
					//console.log("Iframe not loaded yet");
					return false;
				}

				var element = false;

				if ($.isNumeric(selector)) {
					element = this.iframe.find(
						'[data-revisionary-index="' + selector + '"]'
					);

					if (element.length > 1) {
						element
							.filter(":hidden")
							.removeAttr("data-revisionary-index");
						element = element.filter(":visible");
					}
				} else {
					element = this.iframe.find(selector);
				}

				//console.log("Iframe element: ", selector, element);
				return element;
			},

			// Find pin element
			pinElement(selector, byElementIndex = false) {
				if ($.isNumeric(selector)) {
					if (byElementIndex)
						return pinElement(
							'[data-revisionary-index="' + selector + '"]'
						);
					else return pinElement('[data-pin-id="' + selector + '"]');
				} else {
					return $("#pins").children(selector);
				}
			},

			// PIN ACTIONS
			pinHover(pin) {
				this.hoveringPin = true;

				// Reset the pin opacity
				if (!this.pinWindowOpen) $("#pins > .pin").css("opacity", "");

				// Hide the cursor
				this.cursorHidden = true;

				// Clear all outlines
				this.removeOutline();

				// Outline the element
				if (pin.type == "live" || pin.type == "style")
					this.outline(pin.element_index, pin.type, pin.private);
			},
			pinUnHover() {
				this.hoveringPin = false;
				this.scrollOnPin = false;

				// Clear all outlines
				this.removeOutline();

				// Show the cursor
				if (!this.pinDragging) this.cursorHidden = false;
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
			Pins() {
				console.log("PINS CHANGEEEEEEEEEED");

				this.applyChanges();
			},

			currentPinType(to, from) {
				console.log("Pin Mode Changed", from, to);

				//this.currentPinTypeWas = from;
				this.pinTypeUpdate(to);
			},

			currentPinPrivate(to, from) {
				console.log("Pin Private Mode Changed", from, to);

				//this.currentPinPrivateWas = from;
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

	function canAccessIFrame(iframe) {
		var html = null;
		try {
			// deal with older browsers
			var doc = iframe[0].contentDocument || iframe[0].contentWindow.document;
			html = doc.body.innerHTML;
		} catch (err) {
			// do nothing
		}

		return html !== null;
	}

	// HELPERS:
	function get_client_cache(key) {
		if (localStorage) {
			return localStorage.getItem(key);
		} else {
			// No support. Use a fallback such as browser cookies or store on the server. !!!
			return false;
		}
	}

	function set_client_cache(key, value) {
		if (localStorage) {
			localStorage.setItem(key, value);
			return true;
		} else {
			// No support. Use a fallback such as browser cookies or store on the server. !!!
			return false;
		}
	}

	function remove_client_cache(key) {
		if (localStorage) {
			localStorage.removeItem(key);
			return true;
		} else {
			// No support. Use a fallback such as browser cookies or store on the server. !!!
			return false;
		}
	}

	function getParameterByName(name, url = window.location.href) {
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return "";
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	function queryParameter(url, key, value = null) {
		var urlParsed = new URL(url);
		var query_string = urlParsed.search;
		var search_params = new URLSearchParams(query_string);

		if (value == "") search_params.delete(key);
		else search_params.set(key, value);

		if (value == null) return getParameterByName(key, url);

		urlParsed.search = search_params.toString();
		var new_url = urlParsed.toString();

		return new_url;
	}

	function currentUrl() {
		//return window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search;
		return window.location.href;
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
