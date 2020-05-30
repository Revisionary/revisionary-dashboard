<template>
	<div id="page" :class="{ sidebarClosed: !$store.state.isSideBarOpen }">
		<TopBar />
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
		middleware: "authentication",
		mounted() {

			this.$nextTick(() => {
				this.$nuxt.$loading.start();
				setTimeout(() => this.$nuxt.$loading.finish(), 500);
			});

		},
		components: {
			TopBar,
			SideBar
		}
	};
</script>

<style lang="scss">
	main {
		width: 100%;
		display: flex;
		position: relative;
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
