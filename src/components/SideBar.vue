<template>
	<aside id="sidebar">
		<div class="wrapper">
			<div class="top-section">
				<nuxt-link
					to="/projects/"
					class="right-tooltip"
					:class="{ active: this.$route.name === 'projects' }"
					:data-tooltip="$store.state.isSideBarOpen ? null : 'Projects'"
				>
					<DashboardIcon />
					<span class="menu-label">Projects</span>
				</nuxt-link>
				<a
					href="#"
					class="right-tooltip"
					:data-tooltip="$store.state.isSideBarOpen ? null : 'Notifications'"
				>
					<NotificationIcon />
					<span class="menu-label">Notifications</span>
				</a>
				<a href="#" class="right-tooltip" :data-tooltip="$store.state.isSideBarOpen ? null : 'Tasks'">
					<TasksIcon />
					<span class="menu-label">Tasks (24)</span>
				</a>
			</div>
			<div class="bottom-section">
				<a href="#" class="right-tooltip" :data-tooltip="$store.state.isSideBarOpen ? null : 'Support'">
					<SupportIcon />
					<span class="menu-label">Support</span>
				</a>
			</div>
		</div>
	</aside>
</template>

<script>
	import DashboardIcon from "~/components/atoms/icon-dashboard.vue";
	import NotificationIcon from "~/components/atoms/icon-notification.vue";
	import TasksIcon from "~/components/atoms/icon-tasks.vue";
	import SupportIcon from "~/components/atoms/icon-support.vue";

	export default {
		components: {
			DashboardIcon,
			NotificationIcon,
			TasksIcon,
			SupportIcon
		}
	};
</script>

<style lang="scss">
	aside#sidebar {
		height: inherit;
		opacity: 1;
		background-color: #ffffff;
		border: 1px solid #eaedf3;
		border-top: none;
		transition: 500ms;

		& > .wrapper {
			height: inherit;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;

			& > * {
				padding: 28px 0;
				width: 100%;
				white-space: nowrap;

				& > a {
					display: flex;
					justify-content: left;
					align-items: center;
					padding: 14px 34px 14px 24px;
					text-decoration: none;
					color: #9ea5ab;
					font-size: 15px;
					line-height: 18px;
					font-weight: 600;

					& > svg {
						margin-right: 14px;
						width: 20px;
					}

					&.active {
						color: #372d2d;
						position: relative;

						&::after {
							content: "";
							position: absolute;
							bottom: 9px;
							left: 24px;
							width: 21px;
							height: 1px;
							background-color: #037ef3;
						}

						& > svg > path {
							stroke: #037ef3;
						}
					}

					&:hover {
						background-color: #f4f6fc;
					}
				}
			}

			.bottom-section {
				width: 100%;
				padding: 0;
				border-top: 1px solid #eaedf3;

				& > a {
					justify-content: center;
				}
			}
		}
	}

	.sidebarClosed {
		aside#sidebar {
			& > .wrapper > * > a {
				padding: 14px 24px 14px 24px;

				& > svg {
					margin-right: 0;
				}

				&.active {
					background-color: #f4f6fc;

					&::after {
						display: none;
					}
				}
			}

			.menu-label {
				display: none;
			}
		}
	}
</style>
