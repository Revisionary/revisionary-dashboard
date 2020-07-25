<template>
	<div id="top-bar" :class="{revise: type == 'revise'}">
		<div class="left-side">
			<nuxt-link class="logo" to="/projects/">
				<Logo />
			</nuxt-link>
			<span
				class="menu-icon"
				:class="{ active: isSideBarOpen }"
				@click="$store.commit('toggleSideBar')"
				v-if="authenticated && type != 'revise'"
			>
				<MenuIcon />
			</span>

			<JumpTo v-if="authenticated" />

			<div class="info" v-if="type == 'revise'">Info</div>
		</div>
		<div class="center-side" v-if="type == 'revise'">
			<div class="tasks tooltip-not-contained bottom-tooltip" data-tooltip="Open Tasks Panel">
				<div class="tasks-count" v-if="incomplete_tasks > 0 || complete_tasks > 0">
					<div class="left" v-if="incomplete_tasks > 0">{{ incomplete_tasks }}</div>
					<div class="done" v-if="complete_tasks > 0">{{ complete_tasks }}</div>
				</div>
				<div v-else>
					<small>No Tasks</small>
				</div>
			</div>

			<div class="versions">
				<details>
					<summary class="selectbox light">
						<VersionIcon />
						<span>v1</span>
						<CaretDownIcon />
					</summary>
					<div class="details-menu versions-list">
						<ul class="menu boxed compact lines">
							<li>
								<span>
									<div class="left">
										<span>
											<VersionIcon />v2 (2 minutes ago)
										</span>
									</div>
									<div class="right">
										<a
											href="#"
											class="show-on-hover tooltip-not-contained"
											data-tooltip="Delete this Phase"
										>&times;</a>
									</div>
								</span>
							</li>
							<li class="add-new">
								<span>
									<div class="left">
										<span>
											<PlusIcon />
											<span>Add New Phase</span>
										</span>
									</div>
									<div class="right"></div>
								</span>
							</li>
						</ul>
					</div>
				</details>
			</div>

			<div class="screens">
				<details>
					<summary class="selectbox light">
						<WindowIcon />
						<span>Custom Screen</span>
						<CaretDownIcon />
					</summary>
					<div class="details-menu versions-list">
						<ul class="menu boxed compact lines">
							<li>
								<span>
									<div class="left">
										<span>
											<LaptopIcon />Laptop (1440x900)
										</span>
									</div>
									<div class="right">
										<a
											href="#"
											class="show-on-hover tooltip-not-contained"
											data-tooltip="Delete this Screen"
										>&times;</a>
									</div>
								</span>
							</li>
							<li class="add-new">
								<span>
									<div class="left">
										<span>
											<PlusIcon />
											<span>Add New Screen</span>
										</span>
									</div>
									<div class="right">
										<ChevronRightIcon class="show-on-hover" />
									</div>
								</span>
							</li>
						</ul>
					</div>
				</details>
			</div>

			<div class="pin-modes">
				<div class="switch">
					<span
						class="bottom-tooltip tooltip-not-contained"
						:class="{ active: pinMode == 'browse' }"
						data-tooltip="Browse Mode"
						@click="changePinMode('browse')"
					>
						<BrowseIcon />
					</span>
					<span
						class="bottom-tooltip tooltip-not-contained"
						:class="{ active: pinMode == 'comment' }"
						data-tooltip="Comment Mode"
						@click="changePinMode('comment')"
					>
						<CommentIcon />
					</span>
					<span
						class="bottom-tooltip tooltip-not-contained"
						:class="{ active: pinMode == 'content' }"
						data-tooltip="Content Mode"
						@click="changePinMode('content')"
					>
						<ContentIcon />
					</span>
					<span
						class="bottom-tooltip tooltip-not-contained"
						:class="{ active: pinMode == 'style' }"
						data-tooltip="Style Mode"
						@click="changePinMode('style')"
					>
						<StyleIcon />
					</span>
				</div>
			</div>

			<div class="limitations">
				<Limitations label="27 Live Pins Left" />
			</div>
		</div>
		<div class="right-side" v-if="$auth.loggedIn">
			<div class="revise" v-if="type == 'revise'">
				<div class="share">
					<ShareIcon />
				</div>
				<div class="notification">
					<NotificationIcon :count="$store.state.newNotificationsCount" />
				</div>
			</div>

			<div class="dashboard" v-else>
				<Limitations v-if="type != 'revise'" />

				<div class="upgrade-button" v-if="type != 'revise'">
					<a
						href="#"
						class="button upgrade"
						v-if="currentUser.level_ID != 1 && currentUser.level_ID != 4"
					>Upgrade</a>
					<a href="#" class="button upgrade" v-else>Invite</a>
				</div>
			</div>

			<details class="profile">
				<summary class="rotate-icon">
					<ProfilePic
						class="profile-pic"
						:firstName="currentUser.first_name"
						:lastName="currentUser.last_name"
						:email="currentUser.email"
						:picture="currentUser.picture"
					/>
					<ChevronDownIcon />
				</summary>
				<div class="details-menu right">
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
		<div class="right-side" v-else>
			<a href="/projects/">Back to homepage</a>
		</div>
	</div>
</template>

<script>
	import Logo from "~/components/atoms/Logo.vue";
	import JumpTo from "~/components/molecules/JumpTo.vue";

	import Limitations from "~/components/molecules/Limitations.vue";

	import ProfilePic from "~/components/atoms/ProfilePic.vue";

	import MenuIcon from "~/components/atoms/icon-menu.vue";
	import ShareIcon from "~/components/atoms/icon-share.vue";
	import NotificationIcon from "~/components/atoms/icon-notification.vue";

	import ChevronDownIcon from "~/components/atoms/icon-chevron-down.vue";
	import ChevronRightIcon from "~/components/atoms/icon-chevron-right.vue";
	import CaretDownIcon from "~/components/atoms/icon-caret-down.vue";

	import PlusIcon from "~/components/atoms/icon-plus.vue";
	import VersionIcon from "~/components/atoms/icon-version.vue";

	import WindowIcon from "~/components/atoms/devices/icon-custom.vue";
	import DesktopIcon from "~/components/atoms/devices/icon-desktop.vue";
	import LaptopIcon from "~/components/atoms/devices/icon-laptop.vue";
	import TabletIcon from "~/components/atoms/devices/icon-tablet.vue";
	import MobileIcon from "~/components/atoms/devices/icon-mobile.vue";

	import BrowseIcon from "~/components/atoms/pin-modes/icon-browse.svg";
	import CommentIcon from "~/components/atoms/pin-modes/icon-comment.svg";
	import ContentIcon from "~/components/atoms/pin-modes/icon-text.svg";
	import StyleIcon from "~/components/atoms/pin-modes/icon-visual.svg";

	export default {
		components: {
			Logo,
			JumpTo,
			Limitations,
			MenuIcon,
			ShareIcon,
			NotificationIcon,
			ProfilePic,
			ChevronDownIcon,
			ChevronRightIcon,
			CaretDownIcon,
			PlusIcon,
			VersionIcon,
			WindowIcon,
			DesktopIcon,
			LaptopIcon,
			TabletIcon,
			MobileIcon,
			BrowseIcon,
			CommentIcon,
			ContentIcon,
			StyleIcon,
		},
		props: {
			type: {
				default: "dashboard",
			},
		},
		data() {
			return {
				pinMode: "browse",
				incomplete_tasks: 42,
				complete_tasks: 9,
			};
		},
		created() {
			if (!this.$auth.loggedIn) this.$store.commit("toggleSideBar", false);
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
	#top-bar {
		background-color: white;
		display: grid;
		grid-auto-flow: column;
		gap: 24px;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
		height: 60px;
		color: #9ea5ab;
		border: 1px solid #eaedf3;

		& > * {
			display: inherit;
			grid-auto-flow: inherit;
			gap: inherit;
			justify-content: inherit;
			align-items: inherit;

			& > * {
				display: inherit;
				grid-auto-flow: inherit;
				gap: inherit;
				justify-content: inherit;
				align-items: inherit;
			}
		}

		&.revise {
			background-color: #010e28;
			border-color: #010e28;

			#jump-to {
				margin-left: 0;

				summary {
					& > svg.chevron-down {
						& > path {
							stroke: white;
						}
					}
				}
			}

			.rotate-icon {
				svg > path {
					stroke: #727781;
				}
			}
		}

		& > .center-side {
			background-color: #1a263d;
			padding: 6px 27px;
			border-radius: 12px;

			& > * {
				height: 30px;
				padding: 0;
			}

			.selectbox {
				color: white;

				& > svg.caret-down {
					& > path {
						fill: white;
					}
				}
			}

			& > .tasks {
				background-color: rgba(255, 255, 255, 0.1);
				padding: 0 9px;
				border-radius: 3px;
				cursor: pointer;

				.tasks-count {
					& > * {
						border-color: #2a2d30;
						font-weight: 700;

						&.done {
							background-color: #79838c;
						}
					}
				}

				&:hover {
					background-color: $color-primary;

					.tasks-count {
						& > * {
							border-color: transparent;
						}
					}
				}
			}

			& > .screens {
				summary {
					& > svg:not(.caret-down) path {
						stroke: white;
					}
				}
			}

			& > .limitations {
				summary > span {
					font-weight: 600;
					font-size: 13px;
					line-height: 16px;
					color: white;
					text-transform: none;
				}
			}
		}

		& > .right-side {
			& > .revise {
				display: grid;
				grid-auto-flow: column;
				align-items: center;
				justify-content: center;
				gap: 10px;

				& > * {
					width: 30px;
					height: 30px;
					background-color: rgba(255, 255, 255, 0.1);
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					cursor: pointer;

					svg {
						width: 12px;

						& > path {
							stroke: white;
						}
					}

					&.notifications {
					}

					&.share {
						background-color: #74b65c;

						& > svg {
							height: 13px;
						}
					}

					&:hover {
						background-color: $color-primary;
					}
				}
			}
		}

		.logo,
		.menu-icon {
			display: block;

			& > svg {
				display: block;
			}
		}

		.menu-icon {
			cursor: pointer;
			user-select: none;

			&.active {
				svg > rect:first-child {
					fill: $color-primary;
				}
			}
		}

		.profile-pic {
			margin-right: 5px;
		}
	}
</style>
