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
				v-if="authenticated"
			>
				<MenuIcon />
			</span>

			<JumpTo v-if="authenticated" />
		</div>
		<div class="center-side"></div>
		<div class="right-side" v-if="$auth.loggedIn">
			<Limitations v-if="type != 'revise'" />

			<div class="upgrade-button" v-if="type != 'revise'">
				<a
					href="#"
					class="button upgrade"
					v-if="currentUser.level_ID != 1 && currentUser.level_ID != 4"
				>Upgrade</a>
				<a href="#" class="button upgrade" v-else>Invite</a>
			</div>

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

	import Limitations from "~/components/molecules/Limitations.vue";

	import ProfilePic from "~/components/atoms/ProfilePic.vue";

	import MenuIcon from "~/components/atoms/icon-menu.vue";
	import ChevronDownIcon from "~/components/atoms/icon-chevron-down.vue";

	export default {
		components: {
			Logo,
			JumpTo,
			Limitations,
			MenuIcon,
			ProfilePic,
			ChevronDownIcon
		},
		props: {
			type: {
				default: "dashboard"
			}
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
					.catch(error => {
						console.log("ERROR: ", error);
						//if (process.browser) window.$nuxt.$root.$loading.fail();
					});
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

		&.revise {
			background-color: #010e28;
			border-color: #010e28;

			#jump-to {
				margin-left: 0;

				& > summary {
					border-color: #010e28;
					background-color: #1a263d;
				}
			}

			.rotate-icon {
				svg > path {
					stroke: #727781;
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
