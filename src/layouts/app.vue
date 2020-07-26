<template>
	<div id="page" :class="{
		sidebarClosed: !$store.state.isSideBarOpen,
		revising: isRevising
	}">
		<TopBar :type="isRevising ? 'revise' : 'dashboard'" v-if="isRevising" />
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
				return this.$route.name == "revise-id";
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
	#page {
		display: grid;
		grid-template-rows: auto 1fr;
	}

	main {
		display: grid;
		grid-auto-flow: column;
		grid-template-columns: auto 1fr;
		width: 100%;
		height: 100vh;

		.revising > & {
			display: flex;
			height: calc(100vh - 60px);

			& > .content {
				flex: 1;
			}
		}

		& > .content {
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
