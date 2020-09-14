<template>
	<div id="pin-window">
		<div class="top">
			<details class="convert">
				<summary class="rotate-icon">
					<span class="pin-type"></span>
					COMMENT PIN
					<ChevronDownIcon />
				</summary>
				<div class="details-menu left">
					<ul class="menu boxed">
						<li>
							<a href="#">Make Private</a>
						</li>
					</ul>
				</div>
			</details>

			<div class="right">
				<span class="global" data-tooltip="Make The Pin Global">
					<WindowIcon />
				</span>
				<span class="close tooltip-not-contained" data-tooltip="Close">
					<CloseIcon />
				</span>
			</div>
		</div>

		<div class="middle">MIDDLE</div>

		<div class="bottom">
			<span class="mark">
				<MarkIcon />MARK
			</span>
			<span class="remove">
				<RemoveIcon />REMOVE
			</span>
			<span class="done">
				<DoneIcon />DONE
			</span>
		</div>
	</div>
</template>

<script>

	import WindowIcon from "~/components/atoms/devices/icon-custom.vue";
	import DesktopIcon from "~/components/atoms/devices/icon-desktop.vue";
	import LaptopIcon from "~/components/atoms/devices/icon-laptop.vue";
	import TabletIcon from "~/components/atoms/devices/icon-tablet.vue";
	import MobileIcon from "~/components/atoms/devices/icon-mobile.vue";

	import CloseIcon from "~/components/atoms/svg/icon-close.svg";

	import MarkIcon from "~/components/atoms/svg/icon-mark.svg";
	import RemoveIcon from "~/components/atoms/svg/icon-remove.svg";
	import DoneIcon from "~/components/atoms/svg/icon-done.svg";

	import ChevronDownIcon from "~/components/atoms/icon-chevron-down.vue";

	export default {
		components: {
			WindowIcon,
			DesktopIcon,
			LaptopIcon,
			TabletIcon,
			MobileIcon,

			ChevronDownIcon,
			CloseIcon,
			MarkIcon,
			RemoveIcon,
			DoneIcon
		},
		props: {
			pin: {
				type: Object,
				default: null
			}
		}
	}
</script>

<style lang="scss">
	#pin-window {
		position: absolute;
		top: 50%;
		left: 50%;

		background-color: white;
		border: 1px solid #eaedf3;
		border-radius: 6px;
		box-shadow: 0px 4px 18px rgba(95, 108, 120, 0.05);
		width: 300px;

		transition: opacity 500ms;

		display: flex;
		flex-direction: column;

		& > * {
			//padding: 0 20px;

			&.top {
				padding: 15px 20px;

				display: flex;
				justify-content: space-between;
				align-items: center;

				.convert {

					summary {
						display: flex;
						align-items: center;
						gap: 5px;
						font-weight: 600;
						font-size: 15px;
						line-height: 18px;
					}

					.pin-type {
						display: inline-block;
						width: 14px;
						height: 14px;
						border: 2px solid #037DF1;
						border-radius: 50%;
					}

				}

				.right {
					display: flex;
					align-items: center;
					gap: 12px;

					.global {
						width: 25px;
						height: 25px;
						background: #F3F5F9;
						border: 1px solid #EAEDF3;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						cursor: pointer;

						svg {
							width: 11px;
						}

						&:hover {
							background-color: $color-primary;

							svg {
								path {
									stroke: white;
								}
							}
						}
					}

					.close {
						cursor: pointer;
					}

				}
			}

			&.middle {
				background-color: #f3f5f9;
				box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.01);
				padding: 20px;
			}

			&.bottom {
				display: grid;
				grid-template-columns: repeat(3, 1fr);

				& > * {
					padding: 17px 15px;
					font-size: 13px;
					line-height: 16px;
					font-weight: 600;
					color: $color-raven;
					text-align: center;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 5px;
					cursor: pointer;

					&:hover {
						opacity: 0.7;
					}

					&.remove {
						border-left: 1px solid #eaedf3;
						border-right: 1px solid #eaedf3;
					}
				}
			}
		}
	}
</style>
