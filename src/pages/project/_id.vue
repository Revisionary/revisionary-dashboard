<template>
	<div class="content">
		<header>
			<div class="subtitle">Project</div>
			<h1>
				<a href="#">
					{{ project.title }}
					<ChevronDownIcon />
				</a>
			</h1>
			<p class="project-description">
				{{ project.body }}
			</p>
		</header>

		<div class="blocks">
			<div v-if="!isLoaded">Loading the Pages...</div>
			<br />
			<br />
			<nuxt-link to="/">&lt; Projects</nuxt-link>
		</div>
	</div>
</template>

<script>
import ChevronDownIcon from "~/components/atoms/icon-chevron-down.vue";

export default {
	components: {
		ChevronDownIcon
	},
	data() {
		return {
			isLoaded: false,
			project: {}
		};
	},
	async created() {
		this.fetchPages();
	},
	methods: {
		async fetchPages() {
			const resp = await this.$axios.$get(
				`https://jsonplaceholder.typicode.com/posts/${this.$route.params.id}`
			);
			if (resp) {
				this.project = resp;
				this.isLoaded = true;
			}
		}
	}
};
</script>

<style></style>
