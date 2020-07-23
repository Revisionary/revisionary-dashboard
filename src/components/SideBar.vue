<template>
	<aside id="sidebar">
		<div class="wrapper">
			<div class="top-section">
				<nuxt-link
					to="/projects/"
					class="right-tooltip"
					:class="{ active: $route.name === 'projects' }"
					:data-tooltip="$store.state.isSideBarOpen ? null : 'Projects'"
				>
					<DashboardIcon />
					<span class="menu-label">Projects</span>
				</nuxt-link>
				<span
					class="right-tooltip notifications"
					:class="{ active: $store.state.openTab == 'notifications' }"
					:data-tooltip="$store.state.isSideBarOpen ? null : 'Notifications'"
					@click.prevent="toggleTab('notifications')"
				>
					<NotificationIcon :hasNew="$store.state.newNotificationsCount > 0" />
					<span class="menu-label">Notifications</span>
				</span>
				<span
					class="right-tooltip"
					:class="{ active: $store.state.openTab == 'tasks' }"
					:data-tooltip="$store.state.isSideBarOpen ? null : 'Tasks'"
					@click.prevent="toggleTab('tasks')"
				>
					<TasksIcon />
					<span class="menu-label">Tasks (24)</span>
				</span>
			</div>
			<div class="bottom-section">
				<a href="#" class="right-tooltip" :data-tooltip="$store.state.isSideBarOpen ? null : 'Support'">
					<SupportIcon />
					<span class="menu-label">Support</span>
				</a>
			</div>
		</div>

		<aside class="panel notifications" :class="{open: $store.state.openTab == 'notifications'}">
			<div class="panel-title">Notifications</div>
			<div class="panel-content">
				<Notifications v-if="$store.state.openTab == 'notifications'" />
			</div>
		</aside>

		<aside class="panel tasks" :class="{open: $store.state.openTab == 'tasks'}">
			<div class="panel-title">Tasks</div>
			<div class="panel-content">Tasks here...</div>
		</aside>
	</aside>
</template>

<script>
	import DashboardIcon from "~/components/atoms/icon-dashboard.vue";
	import NotificationIcon from "~/components/atoms/icon-notification.vue";
	import TasksIcon from "~/components/atoms/icon-tasks.vue";
	import SupportIcon from "~/components/atoms/icon-support.vue";

	import Notifications from "~/components/organisms/Notifications.vue";

	export default {
		components: {
			DashboardIcon,
			NotificationIcon,
			TasksIcon,
			SupportIcon,
			Notifications,
		},
		methods: {
			toggleTab(tabName) {
				this.$store.commit("toggleTab", tabName);
			},
		},
	};
</script>

<style lang="scss">
	aside#sidebar {
		height: inherit;
		transition: 500ms;
		position: relative;

		& > .wrapper {
			background-color: #ffffff;
			border: 1px solid #eaedf3;
			border-top: none;
			position: relative;
			z-index: 8;
			height: inherit;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;

			& > * {
				padding: 28px 0;
				width: 100%;
				white-space: nowrap;

				& > * {
					display: flex;
					justify-content: left;
					align-items: center;
					padding: 14px 34px 14px 24px;
					text-decoration: none;
					color: #9ea5ab;
					font-size: 15px;
					line-height: 18px;
					font-weight: 600;
					cursor: pointer;
					user-select: none;

					& > svg {
						margin-right: 14px;
						width: 20px;
					}

					&.active {
						color: #372d2d;
						position: relative;

						&::before {
							content: "";
							position: absolute;
							bottom: 9px;
							left: 24px;
							width: 21px;
							height: 1px;
							background-color: $color-primary;
						}

						& > svg > path {
							stroke: $color-primary;
						}

						&.notifications::before {
							width: 18px;
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

				& > * {
					justify-content: center;
				}
			}
		}
	}

	aside.panel {
		width: 285px;
		position: absolute;
		z-index: 7;
		top: 0;
		left: 100%;
		height: 100%;
		border-right: 1px solid #eaedf3;
		background-color: #f5f7fa;
		transition: 500ms;
		transform: translateX(-100%);

		&.open {
			transform: translateX(0%);
		}

		& > .panel-title {
			background-color: #fff;
			font-weight: 600;
			font-size: 12px;
			line-height: 14px;
			text-transform: uppercase;
			padding: 20px 26px;
			border-left: none;
			border-right: none;
		}

		& > .panel-content {
			padding: 20px 25px;
			overflow: auto;
			max-height: calc(100% - 55px);
		}
	}

	.sidebarClosed {
		aside#sidebar {
			& > .wrapper > * > * {
				padding: 14px 24px 14px 24px;

				& > svg {
					margin-right: 0;
				}

				&.active {
					background-color: #f4f6fc;

					&::before {
						display: none;
					}
				}
			}

			.menu-label {
				display: none;
			}
		}
	}

	.revising {
		aside#sidebar {
			position: fixed;
		}

		&:not(.sidebarClosed) {
			aside#sidebar {
				display: none;
			}
		}
	}
</style>
