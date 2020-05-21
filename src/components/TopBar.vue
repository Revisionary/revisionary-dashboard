<template>
	<div id="top-bar">
		<div class="left-side">
			<nuxt-link class="logo" to="/projects/">
				<Logo />
			</nuxt-link>
			<span
				class="menu-icon"
				:class="{ active: $store.state.isSideBarOpen }"
				@click.prevent="$store.commit('toggleSideBar')"
			>
				<MenuIcon />
			</span>

			<JumpTo />
		</div>
		<div class="center-side"></div>
		<div class="right-side">
			<a href="#" class="plan-limitations">Free Plan</a>

			<a href="#" class="button">Upgrade</a>

			<details>
				<summary>
					<ProfilePic class="profile-pic" firstName="Bilal" lastName="TAS" email="bilaltas@me.com" />
					<ChevronDownIcon />
				</summary>
				<div class="details-menu sub-menu right">
					<ul>
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
							<a href="#">Logout</a>
						</li>
					</ul>
				</div>
			</details>
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
		}
	};
</script>

<style lang="scss">
	#top-bar {
		background-color: #232830;
		background-color: white;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
		height: 60px;
		color: #9ea5ab;
		border: 1px solid #eaedf3;

		a {
			color: #9ea5ab;
			text-decoration: none;

			&:hover {
				color: #037ef3;

				svg > rect {
					fill: #037ef3;
				}
			}
		}

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

			&.active {
				svg > rect:first-child {
					fill: #037ef3;
				}
			}
		}

		.plan-limitations {
			text-transform: uppercase;
			border-bottom: 1px dashed;
			padding-bottom: 3px;
		}

		.profile-pic {
			margin-right: 10px;
		}
	}
</style>
