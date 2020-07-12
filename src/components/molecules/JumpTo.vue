<template>
	<details id="jump-to">
		<summary class="selectbox" @click="fetchProjects">
			<span class="current" v-html="current"></span>
			<CaretDownIcon />
		</summary>
		<div class="details-menu">
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
					<nuxt-link :to="`/project/${eachProject.ID}`">
						<div class="left" @click.prevent="bringPages(eachProject.ID)">
							<span class="status" :class="{done: eachProject.incomplete_tasks == 0}"></span>
							<span v-html="eachProject.title"></span>
						</div>
						<div class="right" @click.prevent="bringPages(eachProject.ID)">
							<ChevronDownIcon />
						</div>
					</nuxt-link>

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
									<span class="status" :class="{done: page.incomplete_tasks == 0}"></span>
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
											<span class="status" :class="{done: phase.incomplete_tasks == 0}"></span>
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
													<span class="status" :class="{done: device.incomplete_tasks == 0}"></span>
													<span>
														<WindowIcon v-if="device.cat_ID == 5" />
														<DesktopIcon v-if="device.cat_ID == 1" />
														<LaptopIcon v-if="device.cat_ID == 2" />
														<TabletIcon v-if="device.cat_ID == 3" />
														<MobileIcon v-if="device.cat_ID == 4" />
														{{device.cat_name}} ({{ device.width ? device.screen_width : device.screen_width }}x{{ device.height ? device.height: device.screen_height }})
													</span>
												</div>
												<div class="right">
													<ChevronRightIcon />
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
	import CaretDownIcon from "~/components/atoms/icon-caret-down.vue";
	import ChevronDownIcon from "~/components/atoms/icon-chevron-down.vue";
	import ChevronRightIcon from "~/components/atoms/icon-chevron-right.vue";
	import PlusIcon from "~/components/atoms/icon-plus.vue";

	import WindowIcon from "~/components/atoms/devices/icon-custom.vue";
	import DesktopIcon from "~/components/atoms/devices/icon-desktop.vue";
	import LaptopIcon from "~/components/atoms/devices/icon-laptop.vue";
	import TabletIcon from "~/components/atoms/devices/icon-tablet.vue";
	import MobileIcon from "~/components/atoms/devices/icon-mobile.vue";

	export default {
		components: {
			CaretDownIcon,
			ChevronDownIcon,
			ChevronRightIcon,
			PlusIcon,
			WindowIcon,
			DesktopIcon,
			LaptopIcon,
			TabletIcon,
			MobileIcon
		},
		data() {
			return {
				pagesFetching: false,
				pages: [],
				phasesFetching: false,
				phases: [],
				devicesFetching: false,
				devices: []
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
				this.phases = [];
				this.devices = [];
			},
			async bringPages(projectID) {
				if (
					this.pages.filter(page => page.project_ID == projectID).length
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
								page => !page.archived && !page.deleted
							);
							this.pagesFetching = false;
						}
					})
					.catch(function(error) {
						console.log("ERROR: ", error);
						this.pagesFetching = false;
					});
			},
			async bringPhases(pageID) {
				if (this.phases.filter(phase => phase.page_ID == pageID).length) {
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
					.catch(function(error) {
						console.log("ERROR: ", error);
						this.phasesFetching = false;
					});
			},
			async bringDevices(phaseID) {
				if (
					this.devices.filter(device => device.phase_ID == phaseID).length
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
					.catch(function(error) {
						console.log("ERROR: ", error);
						this.devicesFetching = false;
					});
			}
		}
	};
</script>

<style lang="scss">
	#jump-to {
		margin-left: 120px;

		.current {
			text-transform: capitalize;
		}

		.status {
			pointer-events: all;
			width: 5px;
			height: 5px;
			border-width: 1px;
			margin-right: 10px;
		}

		ul.menu.boxed {
			max-height: calc(90vh - 65px);
		}

		.projectactive {
			& > a {
				color: black;
			}
		}
	}
</style>
