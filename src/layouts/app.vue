<template>
	<div id="page" :class="{
		sidebarClosed: !$store.state.isSideBarOpen,
		revising: isRevising
	}">
		<TopBar :type="isRevising ? 'revise' : 'dashboard'" />
		<main>
			<SideBar />
			<nuxt />
		</main>
	</div>
</template>

<script>
	import TopBar from "~/components/TopBar.vue";
	import SideBar from "~/components/SideBar.vue";

	export default {
		components: {
			TopBar,
			SideBar,
		},
		computed: {
			isRevising() {
				return this.$route.name == "revise-deviceID";
			},
		},
		created() {
			console.log("APP CREATED");

			setTimeout(() => {
				// First notification check after 2 sconds
				this.$store.dispatch("checkNotifications");

				// Check notifications every 10 seconds
				setInterval(() => {
					if (this.$auth.loggedIn)
						this.$store.dispatch("checkNotifications");
				}, 10000);
			}, 2000);
		},
	};
</script>

<style lang="scss">
	main {
		display: flex;
		width: 100%;
		height: calc(100vh - 61px);

		& > .content {
			flex: 1;
			vertical-align: top;
			height: inherit;
			overflow-y: auto;

			& > header {
				background-color: #fff;
				padding: 40px 55px;
				border-bottom: 1px solid #eaedf3;
			}

			& > .content-wrapper {
				padding: 55px;
			}
		}
	}
</style>
