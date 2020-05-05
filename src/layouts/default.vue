<template>
	<div id="page" v-bind:class="{ sidebarOpen: $store.state.isSideBarOpen }">
		<TopBar />
		<main>
			<SideBar />
			<nuxt />
		</main>
		<Footer />
	</div>
</template>

<script>
	import TopBar from "~/components/TopBar.vue";
	import SideBar from "~/components/SideBar.vue";
	import Footer from "~/components/Footer.vue";

	export default {
		components: {
			TopBar,
			SideBar,
			Footer
		},
		data() {
			return {
				//isSideBarOpen: $store.state.isSideBarOpen
			};
		}
	};
</script>

<style lang="scss">
	@import "~/assets/style/global";

	main {
		width: 100%;
		display: table;

		& > .content {
			display: table-cell;
			vertical-align: top;

			& > header {
				background-color: #fff;
				padding: 40px 55px;
				border-bottom: 1px solid #eaedf3;
			}
		}
	}

	.sidebarOpen {
		main {
			& > aside {
				display: table-cell;
			}
		}
	}
</style>
