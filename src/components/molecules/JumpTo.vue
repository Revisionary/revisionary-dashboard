<template>
	<details id="jump-to">
		<summary class="selectbox" :class="{ light: $route.name == 'revise-id' }" @click="fetchProjects">
			<span class="current" v-html="current"></span>
			<ChevronDownIcon v-if="$route.name == 'revise-id'" />
			<CaretRightIcon v-else />
		</summary>
		<div class="details-menu next top">
			<ul class="menu boxed">
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
				<li v-else-if="!projects.filter(project => !project.archived && !project.deleted).length">
					<span>No projects added yet.</span>
				</li>
				<li
					v-else
					v-for="eachProject in projects.filter(project => !project.archived && !project.deleted)"
					:key="eachProject.ID"
					:class="{
						active : pages.filter(page => page.project_ID == eachProject.ID).length || pagesFetching == eachProject.ID,
						projectactive : project.ID == eachProject.ID
					}"
				>
					<span :to="`/project/${eachProject.ID}`" @click.prevent="bringPages(eachProject.ID)">
						<div class="left">
							<TasksStatus
								:incompletedCount="eachProject.incomplete_tasks"
								:completedCount="eachProject.complete_tasks"
							/>
							<span v-html="eachProject.title"></span>
							<nuxt-link :to="`/project/${eachProject.ID}`" class="opener">
								<ArrowRightIcon />
							</nuxt-link>
						</div>
						<div class="right">
							<ChevronDownIcon />
						</div>
					</span>

					<ul
						class="menu sub"
						v-if="pages.filter(page => page.project_ID == eachProject.ID).length || pagesFetching == eachProject.ID"
					>
						<li v-if="pagesFetching == eachProject.ID">
							<span>Loading...</span>
						</li>
						<li
							v-for="page in pages.filter(page => page.project_ID == eachProject.ID)"
							:key="page.ID"
							:class="{active: phases.filter(phase => phase.page_ID == page.ID).length || phasesFetching == page.ID}"
						>
							<span @click="bringPhases(page.ID)">
								<div class="left">
									<TasksStatus
										:incompletedCount="page.incomplete_tasks"
										:completedCount="page.complete_tasks"
									/>
									<span v-html="page.title"></span>
								</div>
								<div class="right">
									<ChevronDownIcon />
								</div>
							</span>

							<ul
								class="menu sub2"
								v-if="phases.filter(phase => phase.page_ID == page.ID).length || phasesFetching == page.ID"
							>
								<li v-if="phasesFetching == page.ID">
									<span>Loading...</span>
								</li>
								<li
									v-for="(phase, index) in phases.filter(phase => phase.page_ID == page.ID)"
									:key="phase.ID"
									:class="{active: devices.filter(device => device.phase_ID == phase.ID).length || devicesFetching == phase.ID}"
								>
									<span @click="bringDevices(phase.ID)">
										<div class="left">
											<TasksStatus
												:incompletedCount="phase.incomplete_tasks"
												:completedCount="phase.complete_tasks"
											/>
											<span>v{{ index + 1 }} ({{$timeSince(phase.created)}} ago)</span>
										</div>
										<span class="right">
											<ChevronDownIcon />
										</span>
									</span>

									<ul
										class="menu sub3"
										v-if="devices.filter(device => device.phase_ID == phase.ID).length || devicesFetching == phase.ID"
									>
										<li v-if="devicesFetching == phase.ID">
											<span>Loading...</span>
										</li>
										<li
											v-for="device in devices.filter(device => device.phase_ID == phase.ID)"
											:key="device.ID"
										>
											<span>
												<div class="left">
													<TasksStatus
														:incompletedCount="device.incomplete_tasks"
														:completedCount="device.complete_tasks"
													/>
													<nuxt-link :to="'/revise/' + device.ID">
														<WindowIcon v-if="device.cat_ID == 5" />
														<DesktopIcon v-if="device.cat_ID == 1" />
														<LaptopIcon v-if="device.cat_ID == 2" />
														<TabletIcon v-if="device.cat_ID == 3" />
														<MobileIcon v-if="device.cat_ID == 4" />
														<span>{{device.cat_name}} ({{ device.width ? device.screen_width : device.screen_width }}x{{ device.height ? device.height: device.screen_height }})</span>
													</nuxt-link>
												</div>
												<div class="right">
													<!-- <ChevronRightIcon /> -->
												</div>
											</span>
										</li>
									</ul>
								</li>
							</ul>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</details>
</template>

<script>
	import { mapGetters } from "vuex";
	import ArrowRightIcon from "~/components/atoms/icon-arrow-right.vue";
	import CaretDownIcon from "~/components/atoms/icon-caret-down.vue";
	import CaretRightIcon from "~/components/atoms/icon-caret-right.vue";
	import ChevronDownIcon from "~/components/atoms/icon-chevron-down.vue";
	import ChevronRightIcon from "~/components/atoms/icon-chevron-right.vue";
	import PlusIcon from "~/components/atoms/icon-plus.vue";

	import WindowIcon from "~/components/atoms/devices/icon-custom.vue";
	import DesktopIcon from "~/components/atoms/devices/icon-desktop.vue";
	import LaptopIcon from "~/components/atoms/devices/icon-laptop.vue";
	import TabletIcon from "~/components/atoms/devices/icon-tablet.vue";
	import MobileIcon from "~/components/atoms/devices/icon-mobile.vue";

	import TasksStatus from "~/components/atoms/tasks-status.vue";

	export default {
		components: {
			ArrowRightIcon,
			CaretDownIcon,
			CaretRightIcon,
			ChevronDownIcon,
			ChevronRightIcon,
			PlusIcon,
			WindowIcon,
			DesktopIcon,
			LaptopIcon,
			TabletIcon,
			MobileIcon,
			TasksStatus,
		},
		data() {
			return {
				pagesFetching: false,
				pages: [],
				phasesFetching: false,
				phases: [],
				devicesFetching: false,
				devices: [],
			};
		},
		computed: {
			...mapGetters({
				projects: "projects/get",
				project: "projects/getProject",
				fetching: "projects/status",
			}),
			current() {
				if (
					(this.$route.name === "project-id" ||
						this.$route.name === "project-id-category") &&
					typeof this.project.title !== "undefined"
				)
					return this.project.title;

				if (this.$route.name == "revise-id") {
					const deviceInfo = this.$store.getters["device/get"];
					const pageName = deviceInfo.page_name;
					const projectName = deviceInfo.project_name;

					return projectName + " > " + pageName;
				}

				return "Jump to...";
			},
		},
		methods: {
			fetchProjects() {
				if (!this.projects.length) this.$store.dispatch("projects/fetch");
			},
			resetPages() {
				this.pages = [];
				this.phases = [];
				this.devices = [];
			},
			async bringPages(projectID) {
				if (
					this.pages.filter((page) => page.project_ID == projectID).length
				) {
					this.pages = [];
					this.phases = [];
					this.devices = [];
					return false;
				}

				this.pagesFetching = projectID;
				this.pages = [];
				this.phases = [];
				this.devices = [];
				await this.$axios
					.get("project/" + projectID + "/pages")
					.then(({ status, data }) => {
						if (status === 200) {
							const pages = data.pages;
							this.pages = pages.filter(
								(page) => !page.archived && !page.deleted
							);
							this.pagesFetching = false;
						}
					})
					.catch(function (error) {
						console.log("ERROR: ", error);
						this.pagesFetching = false;
					});
			},
			async bringPhases(pageID) {
				if (this.phases.filter((phase) => phase.page_ID == pageID).length) {
					this.phases = [];
					this.devices = [];
					return false;
				}

				console.log("Phases fetching for ", pageID);

				this.phasesFetching = pageID;
				this.phases = [];
				this.devices = [];
				await this.$axios
					.get("page/" + pageID + "/phases")
					.then(({ status, data }) => {
						if (status === 200) {
							const phases = data.phases;
							console.log("PHASES of Page #" + pageID, phases);
							this.phases = phases;
							this.phasesFetching = false;
						}
					})
					.catch(function (error) {
						console.log("ERROR: ", error);
						this.phasesFetching = false;
					});
			},
			async bringDevices(phaseID) {
				if (
					this.devices.filter((device) => device.phase_ID == phaseID)
						.length
				) {
					this.devices = [];
					return false;
				}

				console.log("Devices fetching for ", phaseID);

				this.devicesFetching = phaseID;
				this.devices = [];
				await this.$axios
					.get("phase/" + phaseID + "/devices")
					.then(({ status, data }) => {
						if (status === 200) {
							const devices = data.devices;
							console.log("DEVICES of Phase #" + phaseID, devices);
							this.devices = devices;
							this.devicesFetching = false;
						}
					})
					.catch(function (error) {
						console.log("ERROR: ", error);
						this.devicesFetching = false;
					});
			},
		},
	};
</script>

<style lang="scss">
	details#jump-to {
		//margin-left: 120px;

		.current {
			text-transform: capitalize;
		}

		summary {
			&:before {
				background-color: rgba(0, 0, 0, 0.35);
			}
		}

		ul.menu.boxed {
			max-height: calc(90vh - 65px);
			overflow: auto;

			li {
				.opener {
					margin-left: 10px;
					opacity: 0;
					transition: 500ms;

					&:hover {
						svg {
							path {
								stroke: $color-primary !important;
							}
						}
					}
				}

				&:hover {
					.opener {
						opacity: 1;
					}
				}
			}
		}

		.projectactive {
			& > a {
				color: black;
			}
		}
	}
</style>
