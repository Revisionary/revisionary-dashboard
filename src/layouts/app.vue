<template>
	<div
		id="page"
		:class="{
		sidebarClosed: !$store.state.isSideBarOpen,
		revising: this.$route.name == 'revise-id'
	}"
	>
		<main>
			<SideBar />
			<nuxt />
		</main>
	</div>
</template>

<script>
	import SideBar from "~/components/SideBar.vue";

	export default {
		components: {
			SideBar,
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
		display: grid;
		grid-template-columns: auto 1fr;
		width: 100%;
		height: 100vh;

		& > .content {
			height: inherit;
			vertical-align: top;
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

		.revising > & {
			display: flex;

			& > .content {
				display: grid;
				grid-template-rows: auto calc(100vh - 60px);
				width: 100%;
			}
		}
	}
</style>
