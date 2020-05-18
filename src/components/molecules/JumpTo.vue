<template>
	<details class="jump-to" :open="jumperOpen ? true : null">
		<summary class="selectbox" @click.prevent="toggleJumper">
			<span class="current">{{ current }}</span>
			<CaretDownIcon />
		</summary>
		<div class="details-menu sub-menu">
			<ul>
				<li
					:class="{active : this.$route.name === 'index'}"
					v-if="this.$route.name !== 'index'"
					@click="toggleJumper"
				>
					<nuxt-link to="/">All Projects</nuxt-link>
				</li>
				<li
					v-for="eachProject in projects"
					v-bind:key="eachProject.ID"
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
				isLoaded: "projects/status"
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
	.jump-to {
		margin-left: 120px;

		.current {
			text-transform: capitalize;
		}
	}
</style>
