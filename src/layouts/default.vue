<template>
	<div id="page" v-bind:class="{ sidebarClosed: !$store.state.isSideBarOpen }">
		<TopBar />
		<main>
			<SideBar />

			<nuxt />

			<Footer />
		</main>
	</div>
</template>

<script>
	import TopBar from "~/components/TopBar.vue";
	import SideBar from "~/components/SideBar.vue";
	import Footer from "~/components/Footer.vue";

	export default {
		mounted() {
			this.$nextTick(() => {
				this.$nuxt.$loading.start();
				setTimeout(() => this.$nuxt.$loading.finish(), 500);
			});
		},
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
		position: relative;
		min-height: calc(100vh - 73px);

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

	.sidebarClosed {
		main {
			& > aside {
				display: none;
			}
		}
	}
</style>
