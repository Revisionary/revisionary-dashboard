<template>
	<div id="top-bar">
		<div class="left-side">
			<nuxt-link class="logo" to="/projects/">
				<Logo />
			</nuxt-link>
			<span
				class="menu-icon"
				:class="{ active: isSideBarOpen }"
				@click="$store.commit('toggleSideBar')"
				v-if="authenticated"
			>
				<MenuIcon />
			</span>

			<JumpTo v-if="authenticated" />
		</div>
		<div class="center-side"></div>
		<div class="right-side" v-if="$auth.loggedIn">
			<details class="plan-limitations">
				<summary>Free Plan</summary>
				<div class="details-menu center">
					<ul class="menu boxed">
						<li class="title">
							<span>Limitations</span>
						</li>
						<li>
							<span>
								<span class="left">Projects</span>
								<span class="right">4/∞</span>
							</span>
						</li>
						<li>
							<span>
								<span class="left">Pages</span>
								<span class="right">4/∞</span>
							</span>
						</li>
						<li>
							<span>
								<span class="left">Phases</span>
								<span class="right">4/∞</span>
							</span>
						</li>
						<li>
							<span>
								<span class="left">Screens</span>
								<span class="right">4/∞</span>
							</span>
						</li>
						<li>
							<span>
								<span class="left">Live Pins</span>
								<span class="right">4/∞</span>
							</span>
						</li>
						<li>
							<span>
								<span class="left">Comment Pins</span>
								<span class="right">4/∞</span>
							</span>
						</li>
						<li>
							<span>
								<span class="left">MB Files</span>
								<span class="right">14.2/2048</span>
							</span>
						</li>
					</ul>
				</div>
			</details>

			<a href="#" class="button upgrade">Upgrade</a>

			<details>
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

	import ProfilePic from "~/components/atoms/ProfilePic.vue";

	import MenuIcon from "~/components/atoms/icon-menu.vue";
	import ChevronDownIcon from "~/components/atoms/icon-chevron-down.vue";

	export default {
		components: {
			Logo,
			JumpTo,
			MenuIcon,
			ProfilePic,
			ChevronDownIcon
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
			}
		},
		methods: {
			logout() {
				this.$nuxt.$loading.start();
				this.$auth.logout();
				this.$store.commit("toggleSideBar", false);
			}
		}
	};
</script>

<style lang="scss">
	#top-bar {
		background-color: white;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
		height: 60px;
		color: #9ea5ab;
		border: 1px solid #eaedf3;

		& > * {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			& > * {
				margin-right: 24px;
			}
		}

		&.dark {
			background-color: #232830;

			a {
				color: #9ea5ab;
				text-decoration: none;

				&:hover {
					color: white;

					svg > rect {
						fill: white;
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

		.plan-limitations {
			& > summary {
				text-transform: uppercase;
				border-bottom: 1px dashed;
				padding-bottom: 3px;

				&:hover {
					color: $color-primary;
				}
			}

			&[open] > summary {
				color: $color-primary;
			}

			.menu {
				& > li {
					& > span {
						.right {
							min-width: 80px;
							justify-content: flex-end;
						}
					}
				}
			}
		}

		.profile-pic {
			margin-right: 10px;
		}
	}
</style>
