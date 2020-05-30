<template>
	<details id="jump-to" :open="jumperOpen ? true : null">
		<summary class="selectbox" @click.prevent="toggleJumper">
			<span class="current">{{ current }}</span>
			<CaretDownIcon />
		</summary>
		<div class="details-menu sub-menu">
			<ul>
				<li
					:class="{active : $route.name === 'projects'}"
					v-if="$route.name !== 'projects'"
					@click="toggleJumper"
				>
					<nuxt-link to="/projects/">All Projects</nuxt-link>
				</li>
				<li v-if="fetching">
					<span>Loading...</span>
				</li>
				<li
					v-else
					v-for="eachProject in projects"
					:key="eachProject.ID"
					:class="{active : project.ID == eachProject.ID}"
					@click="toggleJumper"
				>
					<nuxt-link :to="`/project/${eachProject.ID}`">{{ eachProject.title.substr(0, 15) }}</nuxt-link>
				</li>
			</ul>
		</div>
	</details>
</template>

<script>
	import { mapGetters } from "vuex";
	import CaretDownIcon from "~/components/atoms/icon-caret-down.vue";

	export default {
		components: {
			CaretDownIcon
		},
		computed: {
			...mapGetters({
				projects: "projects/get",
				project: "projects/getProject",
				fetching: "projects/status"
			}),
			current() {
				if (
					this.$route.name === "project-id" &&
					typeof this.project.title !== "undefined"
				)
					return this.project.title.substr(0, 15);

				return "Jump to...";
			}
		},
		methods: {
			toggleJumper() {
				if (this.jumperOpen) this.jumperOpen = false;
				else {
					if (!this.projects.length && !this.jumperOpen)
						this.$store.dispatch("projects/fetch");

					this.jumperOpen = true;
				}
			}
		},
		data() {
			return {
				jumperOpen: false
			};
		}
	};
</script>

<style lang="scss">
	#jump-to {
		margin-left: 120px;

		.current {
			text-transform: capitalize;
		}
	}
</style>
