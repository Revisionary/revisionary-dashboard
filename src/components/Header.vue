<template>
	<header id="main-header">
		<div class="left-side">
			<nuxt-link class="logo" to="/">
				<Logo />
			</nuxt-link>
			<a
				href="#"
				class="menu-icon"
				v-bind:class="{ active: $store.state.isSideBarOpen }"
				@click.prevent="$store.commit('toggleSideBar')"
			>
				<MenuIcon />
			</a>

			<JumpTo />
		</div>
		<div class="center-side"></div>
		<div class="right-side">
			<a href="#" class="plan-limitations">Free Plan</a>

			<a href="#" class="button">Upgrade</a>

			<a href="#">
				<ProfilePic class="profile-pic" firstName="Bilal" lastName="TAS" email="bilaltas@me.com" />
				<ChevronDownIcon />
			</a>
		</div>
	</header>
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
	header#main-header {
		background-color: #232830;
		background-color: white;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
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
