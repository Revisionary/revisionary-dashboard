<template>
	<aside id="sidebar">
		<div class="wrapper">
			<div class="top-section">
				<nuxt-link to="/projects/" class="menu-item">
					<Logo />
				</nuxt-link>

				<JumpTo class="jumper" />

				<span
					class="right-tooltip menu-item projects"
					:class="{ active: $route.name === 'projects' }"
					:data-tooltip="$store.state.isSideBarOpen ? null : 'Projects'"
					@click="toggleTab('projects')"
					v-if="false"
				>
					<DashboardIcon />
					<span class="menu-label">Projects</span>
				</span>

				<span
					class="right-tooltip menu-item tasks"
					:class="{ active: $store.state.openTab == 'tasks' }"
					:data-tooltip="$store.state.isSideBarOpen ? null : 'Tasks'"
					@click="toggleTab('tasks')"
				>
					<TasksIcon />
					<span class="menu-label">Tasks (24)</span>
				</span>

				<span
					class="right-tooltip menu-item notifications"
					:class="{ active: $store.state.openTab == 'notifications' }"
					:data-tooltip="$store.state.isSideBarOpen ? null : 'Notifications'"
					@click="toggleTab('notifications')"
				>
					<NotificationIcon :count="$store.state.newNotificationsCount" />
					<span class="menu-label">Notifications</span>
				</span>

				<hr class="separator" />

				<span
					class="right-tooltip menu-item usage"
					:class="{ active: $store.state.openTab == 'usage' }"
					:data-tooltip="$store.state.isSideBarOpen ? null : 'Usage'"
					@click="toggleTab('usage')"
				>
					<DashboardIcon />
					<span class="menu-label">My Plan & Usage</span>
				</span>
			</div>

			<div class="bottom-section">
				<div class="profile menu-item">
					<details>
						<summary class="rotate-icon">
							<ProfilePic
								class="profile-pic"
								:firstName="currentUser.first_name"
								:lastName="currentUser.last_name"
								:email="currentUser.email"
								:picture="currentUser.picture"
							/>
							<span>{{ currentUser.first_name }}</span>
							<ChevronDownIcon />
						</summary>
						<div class="details-menu left top">
							<ul class="menu boxed">
								<li>
									<a href="#">Account</a>
								</li>
								<li>
									<a href="#">Help</a>
								</li>
								<li>
									<a href="#">Feedback</a>
								</li>
								<li>
									<a href="#" @click.prevent="logout">Logout</a>
								</li>
							</ul>
						</div>
					</details>
				</div>

				<span
					class="right-tooltip menu-item"
					:data-tooltip="$store.state.isSideBarOpen ? null : 'Support'"
				>
					<SupportIcon />
					<span class="menu-label">Support</span>
				</span>
			</div>
		</div>

		<aside class="panel" :class="{open: $store.state.openTab == 'projects'}">
			<div class="panel-title">Projects</div>
			<div class="panel-content">Jumper here</div>
		</aside>

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

		<aside class="panel usage" :class="{open: $store.state.openTab == 'usage'}">
			<div class="panel-title">Usage</div>
			<div class="panel-content">
				<Limitations v-if="$store.state.openTab == 'usage'" />
			</div>
		</aside>
	</aside>
</template>

<script>
	import Logo from "~/components/atoms/svg/logo-revisionary.svg";
	import JumpTo from "~/components/molecules/JumpTo.vue";

	import DashboardIcon from "~/components/atoms/icon-dashboard.vue";
	import NotificationIcon from "~/components/atoms/icon-notification.vue";
	import TasksIcon from "~/components/atoms/icon-tasks.vue";
	import SupportIcon from "~/components/atoms/icon-support.vue";
	import ProfilePic from "~/components/atoms/ProfilePic.vue";
	import ChevronDownIcon from "~/components/atoms/icon-chevron-down.vue";

	import Notifications from "~/components/organisms/Notifications.vue";
	import Limitations from "~/components/organisms/Limitations.vue";

	export default {
		components: {
			Logo,
			JumpTo,
			DashboardIcon,
			NotificationIcon,
			TasksIcon,
			SupportIcon,
			ProfilePic,
			Notifications,
			Limitations,
			ChevronDownIcon,
		},
		computed: {
			authenticated() {
				return this.$auth.loggedIn;
			},
			currentUser() {
				return this.$auth.user;
			},
			isSideBarOpen() {
				return this.$store.state.isSideBarOpen;
			},
		},
		methods: {
			toggleTab(tabName) {
				this.$store.commit("toggleTab", tabName);
			},
			logout() {
				this.$nuxt.$loading.start();

				this.$auth
					.logout()
					.then(() => {
						console.log("Logged out");

						// Close the sidebar
						this.$store.commit("toggleSideBar", false);

						// Reset Projects
						this.$store.dispatch("projects/resetProjects");

						// Reset Pages
						this.$store.dispatch("pages/resetPages");

						// Reset Users Pool
						this.$store.dispatch("users/resetUsers");

						// Redirect to login page
						this.$router.push({ path: "/login/" });
					})
					.catch((error) => {
						console.log("ERROR: ", error);
						//if (process.browser) window.$nuxt.$root.$loading.fail();
					});
			},
			changePinMode(mode = "browse") {
				this.pinMode = mode;
			},
		},
	};
</script>

<style lang="scss">
	aside#sidebar {
		height: inherit;
		position: relative;

		& > .wrapper {
			background-color: #ffffff;
			border: 1px solid #eaedf3;
			border-top: none;
			border-bottom: none;
			position: relative;
			z-index: 8;
			height: inherit;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;

			& > * {
				padding: 10px 0;
				width: 100%;
				white-space: nowrap;
				display: grid;
				justify-content: left;
				align-items: center;
				grid-template-rows: 1fr;

				& > .menu-item {
					display: grid;
					grid-auto-flow: column;
					grid-template-columns: 20px 1fr;
					justify-content: left;
					align-items: center;
					gap: 14px;
					padding: 14px 24px 14px 24px;
					text-decoration: none;
					color: #9ea5ab;
					font-size: 15px;
					line-height: 18px;
					font-weight: 600;
					cursor: pointer;
					user-select: none;

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

						svg > path {
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

				& > .jumper {
					padding: 5px 10px;

					.selectbox {
						height: 45px;
					}
				}

				& > hr.separator {
					border-color: #eaedf3;
					border-style: solid;
					border-bottom: none;
					width: 90%;
					margin: 10px auto;
				}
			}

			.bottom-section {
				padding: 0;
				border-top: 1px solid #eaedf3;

				& > * {
					justify-content: center;
					width: 100%;
				}

				.profile {
					summary {
						display: grid;
						grid-auto-flow: column;
						justify-content: space-between;
						align-items: center;
						gap: 5px;

						svg.chevron-down {
							path {
								stroke: #9ea5ab;
							}
						}
					}
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
			z-index: 1;
			left: 100%;
			bottom: 0;
			height: calc(100vh - 60px);
		}

		aside.panel {
			left: auto;
			transform: translateX(0);
			border-left: 1px solid #eaedf3;
			border-right: none;

			&.open {
				transform: translateX(-100%);
			}
		}
	}
</style>
