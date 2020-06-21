<template>
	<details id="jump-to">
		<summary class="selectbox" @click="fetchProjects">
			<span class="current" v-html="current"></span>
			<CaretDownIcon />
		</summary>
		<div class="details-menu sub-menu">
			<ul>
				<li :class="{active : $route.name === 'projects'}" v-if="$route.name !== 'projects'">
					<nuxt-link to="/projects/">All Projects</nuxt-link>
				</li>
				<li v-if="fetching">
					<span>Loading...</span>
				</li>
				<li
					v-else
					v-for="eachProject in projects.filter(project => !project.archived && !project.deleted)"
					:key="eachProject.ID"
					class="with-tasks"
					:class="{active : project.ID == eachProject.ID}"
				>
					<nuxt-link :to="`/project/${eachProject.ID}`">
						<span v-html="eachProject.title"></span>
						<span class="jumper-plus-icon" @click.prevent="bringPages(eachProject.ID)">+</span>
					</nuxt-link>

					<div class="tasks-count">
						<div
							class="left tooltip-not-contained"
							data-tooltip="Incomplete"
							v-if="eachProject.incomplete_tasks > 0"
						>{{ eachProject.incomplete_tasks }}</div>
						<div
							class="done tooltip-not-contained"
							data-tooltip="Solved"
							v-if="eachProject.complete_tasks > 0"
						>{{ eachProject.complete_tasks }}</div>
					</div>
				</li>
			</ul>
		</div>
	</details>
</template>

<script>
	import { mapGetters } from "vuex";
	import CaretDownIcon from "~/components/atoms/icon-caret-down.vue";
	import PlusIcon from "~/components/atoms/icon-plus.vue";

	export default {
		components: {
			CaretDownIcon,
			PlusIcon
		},
		computed: {
			...mapGetters({
				projects: "projects/get",
				project: "projects/getProject",
				fetching: "projects/status"
			}),
			current() {
				if (
					(this.$route.name === "project-id" ||
						this.$route.name === "project-id-category") &&
					typeof this.project.title !== "undefined"
				)
					return this.project.title;

				return "Jump to...";
			}
		},
		methods: {
			fetchProjects() {
				if (!this.projects.length) this.$store.dispatch("projects/fetch");
			},
			bringPages(projectID) {
				console.log("ASD");
			}
		}
	};
</script>

<style lang="scss">
	#jump-to {
		margin-left: 120px;

		& > .details-menu {
			max-height: calc(90vh - 65px);
			overflow-x: hidden;
			overflow-y: auto;
		}

		.current {
			text-transform: capitalize;
		}

		.with-tasks {
			.tasks-count > * {
				width: 15px;
				height: 15px;
				font-size: 9px;
				letter-spacing: -1px;
			}

			.jumper-plus-icon {
				margin-left: 10px;
				font-size: 18px;
				color: #9ea5ab;

				&:hover {
					color: black;
				}
			}
		}
	}
</style>
