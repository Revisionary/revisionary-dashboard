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
				>
					<nuxt-link :to="`/project/${eachProject.ID}`">
						<div class="status" :class="{done: eachProject.incomplete_tasks == 0}"></div>
						<span v-html="eachProject.title" @click="resetPages"></span>
						<div
							class="bring-pages"
							:class="{active: pages.filter(page => page.project_ID == eachProject.ID).length || pagesFetching == eachProject.ID}"
							@click.prevent="bringPages(eachProject.ID)"
						>
							<ChevronDownIcon />
						</div>
					</nuxt-link>

					<ul
						class="inner-submenu"
						v-if="pages.filter(page => page.project_ID == eachProject.ID).length || pagesFetching == eachProject.ID"
					>
						<li v-if="pagesFetching == eachProject.ID">
							<span>Loading...</span>
						</li>
						<li v-for="page in pages.filter(page => page.project_ID == eachProject.ID)" :key="page.ID">
							<span
								@click="bringPhases(page.ID)"
								:class="{active: phases.filter(phase => phase.page_ID == page.ID).length || phasesFetching == page.ID}"
							>
								<div class="status" :class="{done: page.incomplete_tasks == 0}"></div>
								<span v-html="page.title"></span>
								<span class="open-phases">
									<ChevronRightIcon />
								</span>
							</span>

							<ul
								class="submenu"
								v-if="phases.filter(phase => phase.page_ID == page.ID).length || phasesFetching == page.ID"
							>
								<li v-if="phasesFetching == page.ID">
									<span>Loading...</span>
								</li>
								<li
									v-for="(phase, index) in phases.filter(phase => phase.page_ID == page.ID)"
									:key="phase.ID"
								>
									<span @click="bringDevices(phase.ID)">
										<div class="status" :class="{done: phase.incomplete_tasks == 0}"></div>
										<span>v{{ index + 1 }}</span>
										<span class="open-devices">
											<ChevronRightIcon />
										</span>
									</span>

									<ul
										class="submenu"
										v-if="devices.filter(device => device.phase_ID == phase.ID).length || devicesFetching == phase.ID"
									>
										<li v-if="devicesFetching == phase.ID">
											<span>Loading...</span>
										</li>
										<li
											v-for="device in devices.filter(device => device.phase_ID == phase.ID)"
											:key="device.ID"
										>
											<a href="#">
												<div class="status" :class="{done: device.incomplete_tasks == 0}"></div>
												<span>
													<WindowIcon v-if="device.cat_ID == 5" />
													<DesktopIcon v-if="device.cat_ID == 1" />
													<LaptopIcon v-if="device.cat_ID == 2" />
													<TabletIcon v-if="device.cat_ID == 3" />
													<MobileIcon v-if="device.cat_ID == 4" />
													{{device.cat_name}} ({{ device.width ? device.screen_width : device.screen_width }}x{{ device.height ? device.height: device.screen_height }})
												</span>
											</a>
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
			},
			async bringPages(projectID) {
				if (
					this.pages.filter(page => page.project_ID == projectID).length
				) {
					this.pages = [];
					return false;
				}

				this.pagesFetching = projectID;
				this.pages = [];
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
			},
			async bringPhases(pageID) {
				if (this.phases.filter(phase => phase.page_ID == pageID).length) {
					this.phases = [];
					return false;
				}

				console.log("Phases fetching for ", pageID);

				this.phasesFetching = pageID;
				this.phases = [];
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

		& > .details-menu {
			max-height: calc(90vh - 65px);
			overflow-y: auto;
			width: 100vw;

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

					& > .inner-submenu {
						background-color: #f5f7fa;
						box-shadow: inset 0px 3px 2px rgba(0, 0, 0, 0.01);
						padding: 0;
						padding-left: 18px;
						list-style-type: none;

						& > li {
							position: relative;

							& > a,
							& > span {
								font-size: 14px;
								font-weight: 500;
								line-height: 17px;
								padding: 10px 45px 10px 10px;
								position: relative;
								display: flex;
								align-items: center;
								cursor: pointer;

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

								&.active,
								&:hover {
									color: black;

									svg path {
										stroke: #037ef3;
									}
								}
							}

							.submenu {
								position: absolute;
								left: 100%;
								top: 0;
								background-color: #fff;
								border: 1px solid #eaedf3;
								padding: 0;
								list-style-type: none;

								& > li {
									position: relative;

									& > a,
									& > span {
										display: flex;
										align-items: center;
										padding: 10px 45px 10px 10px;
										cursor: pointer;

										& > .open-devices {
											position: absolute;
											right: 0;
											top: 50%;
											transform: translateY(-50%);
											padding: 10px 15px;
											justify-content: flex-end;
										}

										&:hover {
											color: black;
										}
									}
								}
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
