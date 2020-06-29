<template>
	<details id="jump-to">
		<summary class="selectbox" @click="fetchProjects">
			<span class="current" v-html="current"></span>
			<CaretDownIcon />
		</summary>
		<div class="details-menu sub-menu">
			<ul>
				<li
					:class="{active : $route.name === 'projects'}"
					v-if="$route.name !== 'projects'"
					@click="resetPages"
				>
					<nuxt-link to="/projects/">All Projects</nuxt-link>
				</li>
				<li v-if="fetching">
					<span>Loading...</span>
				</li>
				<li
					v-else
					v-for="eachProject in projects.filter(project => !project.archived && !project.deleted)"
					:key="eachProject.ID"
					:class="{active : pages.filter(page => page.project_ID == eachProject.ID).length || pagesFetching == eachProject.ID, projectactive : project.ID == eachProject.ID}"
					@click="resetPages"
				>
					<nuxt-link :to="`/project/${eachProject.ID}`">
						<div class="status" :class="{done: eachProject.incomplete_tasks == 0}"></div>
						<span v-html="eachProject.title"></span>
						<div
							class="bring-pages"
							:class="{active: pages.filter(page => page.project_ID == eachProject.ID).length || pagesFetching == eachProject.ID}"
							@click.prevent="bringPages(eachProject.ID)"
						>
							<ChevronDownIcon />
						</div>
					</nuxt-link>

					<ul
						class="submenu"
						v-if="pages.filter(page => page.project_ID == eachProject.ID).length || pagesFetching == eachProject.ID"
					>
						<li v-if="pagesFetching == eachProject.ID">
							<span>Loading...</span>
						</li>
						<li v-for="page in pages.filter(page => page.project_ID == eachProject.ID)" :key="page.ID">
							<a href="#">
								<div class="status" :class="{done: page.incomplete_tasks == 0}"></div>
								<span v-html="page.title"></span>
								<span class="open-phases">
									<ChevronRightIcon />
								</span>
							</a>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</details>
</template>

<script>
	import { mapGetters } from "vuex";
	import CaretDownIcon from "~/components/atoms/icon-caret-down.vue";
	import ChevronDownIcon from "~/components/atoms/icon-chevron-down.vue";
	import ChevronRightIcon from "~/components/atoms/icon-chevron-right.vue";
	import PlusIcon from "~/components/atoms/icon-plus.vue";

	export default {
		components: {
			CaretDownIcon,
			ChevronDownIcon,
			ChevronRightIcon,
			PlusIcon
		},
		data() {
			return {
				pagesFetching: false,
				pages: []
			};
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
			resetPages() {
				this.pages = [];
			},
			async bringPages(projectID) {
				this.pagesFetching = projectID;
				await this.$axios
					.get("project/" + projectID + "/pages")
					.then(({ status, data }) => {
						if (status === 200) {
							const pages = data.pages;
							this.pages = pages;
							this.pagesFetching = false;
						}
					})
					.catch(function(error) {
						console.log("ERROR: ", error);
						this.pagesFetching = false;
					});
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

			.status {
				pointer-events: all;
				width: 5px;
				height: 5px;
				border-width: 1px;
				margin-right: 10px;
			}

			& > ul {
				& > li {
					& > a {
						font-weight: 500;
						font-size: 14px;
						line-height: 17px;
						padding: 10px 45px 10px 10px;
						color: #8b96ad;
						letter-spacing: 0.1px;
						min-width: 250px;
						position: relative;

						&:hover {
							color: black;
						}

						& > .bring-pages {
							position: absolute;
							right: 0;
							top: 50%;
							transform: translateY(-50%);
							padding: 10px 15px;
							justify-content: flex-end;
							cursor: pointer;

							svg {
								width: auto;

								path {
									stroke: #8b96ad;
								}
							}

							&.active,
							&:hover {
								svg path {
									stroke: #037ef3;
								}
							}
						}
					}

					&.projectactive {
						& > a {
							color: black !important;
						}
					}

					&.active {
						& > a {
							color: #037ef3 !important;
						}
					}

					& > .submenu {
						background-color: #f5f7fa;
						box-shadow: inset 0px 3px 2px rgba(0, 0, 0, 0.01);
						//padding: 12px 20px 20px;
						padding: 0;
						padding-left: 18px;
						list-style-type: none;

						& > li {
							& > a,
							& > span {
								font-size: 14px;
								font-weight: 500;
								line-height: 17px;
								padding: 10px 45px 10px 10px;
								position: relative;
								display: flex;
								align-items: center;

								& > .status {
									opacity: 0.5;
								}

								& > .open-phases {
									position: absolute;
									right: 0;
									top: 50%;
									transform: translateY(-50%);
									padding: 10px 15px;

									svg {
										display: block;
									}
								}

								&:hover {
									svg path {
										stroke: #037ef3;
									}
								}
							}

							.tasks-count {
								opacity: 0.7;
								top: 0;
							}
						}
					}
				}
			}
		}

		.current {
			text-transform: capitalize;
		}
	}
</style>
