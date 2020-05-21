<template>
	<aside>
		<div class="wrapper">
			<div class="top-section">
				<nuxt-link to="/projects/" v-bind:class="{ active: this.$route.name === 'projects' }">
					<DashboardIcon />Dashboard
				</nuxt-link>
				<a href="#">
					<NotificationIcon />Notifications
				</a>
				<a href="#">
					<TasksIcon />Tasks (24)
				</a>
			</div>
			<div class="bottom-section">
				<a href="#">
					<SupportIcon />Support
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
		},
		data() {
			return {
				//isSideBarOpen: this.$store.state.isSideBarOpen
			};
		}
	};
</script>

<style lang="scss">
	aside {
		width: 190px;
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
		aside {
			width: 0;
			opacity: 0;
		}
	}
</style>
