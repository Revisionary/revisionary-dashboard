<template>
	<div class="card">
		<div
			class="top"
			:style="'background-image: url(' + blockData.image_url + ');'"
		>
			<div class="actions">
				<div class="top">
					<div class="left">
						<div class="multiple-profiles">
							<span class="owner">
								<ProfilePic
									:firstName="ownerInfo.first_name"
									:lastName="ownerInfo.last_name"
									:picture="ownerInfo.picture"
									:email="ownerInfo.email"
								/>
							</span>
							<span
								class="shared"
								v-for="(user_ID, index) in blockData.users"
								:key="user_ID"
							>
								<ProfilePic
									v-if="index < 2 || (index == 2 && blockData.users.length == 3)"
									:firstName="userInfo(user_ID).first_name"
									:lastName="userInfo(user_ID).last_name"
									:picture="userInfo(user_ID).picture"
									:email="userInfo(user_ID).email"
								/>
								<ProfilePic
									v-if="index == 2 && blockData.users.length > 3"
									:abbreviation="(blockData.users.length - 2).toString()"
									:data-tooltip="(blockData.users.length - 2).toString() + ' more person'"
								/>
							</span>
						</div>
						<button
							class="transparent with-icon share"
							v-if="$route.name == 'projects' || $route.name == 'projects-category'"
						>
							<ShareIcon />Share
						</button>
					</div>
					<div class="center"></div>
					<div class="right">
						<div
							class="tasks-count"
							v-if="blockData.incomplete_tasks > 0 || blockData.complete_tasks > 0"
						>
							<div
								class="left tooltip-not-contained"
								data-tooltip="Incomplete"
								v-if="blockData.incomplete_tasks > 0"
							>{{ blockData.incomplete_tasks }}</div>
							<div
								class="done tooltip-not-contained"
								data-tooltip="Solved"
								v-if="blockData.complete_tasks > 0"
							>{{ blockData.complete_tasks }}</div>
						</div>
						<div v-else>
							<small>No Tasks</small>
						</div>
					</div>
				</div>
				<div class="middle">
					<div class="left"></div>
					<div class="center">
						<nuxt-link
							class="tooltip-not-contained"
							:to="`/project/${blockData.ID}`"
							v-if="$route.name == 'projects' || $route.name == 'projects-category'"
							data-tooltip="Open this project"
						>
							<ArrowRightIcon />
						</nuxt-link>

						<details v-else>
							<summary class="rotate-icon">
								<div
									class="button rounded with-icon icon-right"
									@click="getDevices(blockData.versions[blockData.versions.length-1].ID)"
								>
									OPEN
									<ChevronDownIcon />
								</div>
							</summary>
							<div class="details-menu center">
								<ul class="menu boxed compact lines">
									<li v-if="devicesFetching">
										<span>Loading...</span>
									</li>
									<li
										v-else
										v-for="device in devices"
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
													<span>{{device.cat_name}} ({{ device.width ? device.width : device.screen_width }}x{{ device.height ? device.height: device.screen_height }})</span>
												</nuxt-link>
											</div>
											<div class="right">
												<a
													href="#"
													class="show-on-hover tooltip-not-contained"
													data-tooltip="Delete this screen"
												>&times;</a>
											</div>
										</span>
									</li>
									<li
										class="add-new"
										v-if="!devicesFetching"
									>
										<span>
											<div class="left">
												<TasksStatus
													:incompletedCount="0"
													:completedCount="0"
												/>
												<span>
													<PlusIcon />
													<span>Add New Screen</span>
												</span>
											</div>
											<div class="right">
												<ChevronRightIcon class="show-on-hover" />
											</div>
										</span>
									</li>
								</ul>
							</div>
						</details>
					</div>
					<div class="right"></div>
				</div>
				<div class="bottom">
					<div
						class="left"
						v-if="$route.name !== 'projects' && $route.name !== 'projects-category'"
					>
						<details>
							<summary>
								<div
									class="button radius"
									@click="getPhases(blockData.ID)"
								>
									<VersionIcon />
									v{{blockData.versions.length}}
									<ChevronDownIcon />
								</div>
							</summary>
							<div class="details-menu versions-list">
								<ul class="menu boxed compact lines">
									<li v-if="phasesFetching">
										<span>Loading...</span>
									</li>
									<li
										v-else
										v-for="(phase, index) in phases"
										:key="phase.ID"
										:class="{ active: index == blockData.versions.length - 1 }"
									>
										<span>
											<div
												class="left"
												@click="getDevices(phase.ID)"
											>
												<TasksStatus
													:incompletedCount="phase.incomplete_tasks"
													:completedCount="phase.complete_tasks"
												/>
												<span>
													<VersionIcon />
													v{{ index + 1 }} ({{$timeSince(phase.created)}} ago)
													<CaretDownIcon class="show-on-hover" />
												</span>
											</div>
											<div class="right">
												<a
													href="#"
													class="show-on-hover tooltip-not-contained"
													data-tooltip="Delete this Phase"
												>&times;</a>
											</div>
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
													<div class="right"></div>
												</span>
											</li>
										</ul>
									</li>
									<li class="add-new">
										<span>
											<div class="left">
												<span>
													<PlusIcon />
													<span>Add New Phase</span>
												</span>
											</div>
											<div class="right"></div>
										</span>
									</li>
								</ul>
							</div>
						</details>
					</div>
					<div class="center"></div>
					<div class="right">
						<details class="block-actions">
							<summary>
								<MoreIcon />
							</summary>
							<div class="details-menu right">
								<ul class="menu boxed">
									<li>
										<a href="#">Edit</a>
									</li>
									<li>
										<a href="#">Archive</a>
									</li>
									<li>
										<a href="#">Delete</a>
									</li>
								</ul>
							</div>
						</details>
					</div>
				</div>
			</div>
			<TasksStatus
				:incompletedCount="blockData.incomplete_tasks"
				:completedCount="blockData.complete_tasks"
				:compact="false"
				:showTooltip="false"
				v-if="blockData.incomplete_tasks > 0 || blockData.complete_tasks > 0"
			/>
		</div>
		<div class="info">
			<div class="title">
				<nuxt-link :to="`/project/${blockData.ID}`">
					<span class="text">
						<span v-html="blockData.title"></span>
					</span>
					<span
						class="count tooltip-not-contained"
						:data-tooltip="$route.name == 'projects' || $route.name == 'projects-category' ? 'Pages Count' : 'Versions Count'"
					>({{ blockData.sub_count }})</span>
				</nuxt-link>
			</div>
			<div class="description">
				<span v-html="blockData.description"></span>
			</div>
		</div>
		<div class="bottom">
			<div
				class="date bottom-tooltip tooltip-not-contained"
				:data-tooltip="'Created ' + $timeSince(blockData.date_created) + ' ago'"
			>{{ $timeSince(blockData.date_modified) }} ago</div>
			<div
				class="favorite"
				:data-tooltip="blockData.favorite ? 'Remove from Favorites' : 'Add to Favorites'"
				@click="toggleFavorite"
			>
				<StarIcon :active="blockData.favorite" />
			</div>
		</div>
	</div>
</template>

<script>
	import ArrowRightIcon from "~/components/atoms/icon-arrow-right.vue";
	import MoreIcon from "~/components/atoms/icon-more.vue";
	import StarIcon from "~/components/atoms/icon-star.vue";
	import VersionIcon from "~/components/atoms/icon-version.vue";
	import ShareIcon from "~/components/atoms/icon-share.vue";
	import CaretDownIcon from "~/components/atoms/icon-caret-down.vue";
	import ChevronDownIcon from "~/components/atoms/icon-chevron-down.vue";
	import ChevronRightIcon from "~/components/atoms/icon-chevron-right.vue";

	import WindowIcon from "~/components/atoms/devices/icon-custom.vue";
	import DesktopIcon from "~/components/atoms/devices/icon-desktop.vue";
	import LaptopIcon from "~/components/atoms/devices/icon-laptop.vue";
	import TabletIcon from "~/components/atoms/devices/icon-tablet.vue";
	import MobileIcon from "~/components/atoms/devices/icon-mobile.vue";

	import PlusIcon from "~/components/atoms/icon-plus.vue";

	import ProfilePic from "~/components/atoms/ProfilePic.vue";

	import TasksStatus from "~/components/atoms/tasks-status.vue";

	export default {
		components: {
			ArrowRightIcon,
			MoreIcon,
			StarIcon,
			VersionIcon,
			ShareIcon,
			CaretDownIcon,
			ChevronDownIcon,
			ChevronRightIcon,
			ProfilePic,
			WindowIcon,
			DesktopIcon,
			LaptopIcon,
			TabletIcon,
			MobileIcon,
			TasksStatus,
			PlusIcon,
		},
		data() {
			return {
				devices: [],
				devicesFetching: false,
				phases: [],
				phasesFetching: false,
			};
		},
		methods: {
			toggleFavorite() {
				const blockID = this.blockData.ID;
				const blockFavorite = this.blockData.favorite;

				this.$store.dispatch("projects/updateProject", {
					ID: blockID,
					name: "favorite",
					value: !blockFavorite,
				});
			},
			userInfo(ID) {
				let foundUser = this.$store.getters["users/getUser"](ID);

				return foundUser;
			},
			async getDevices(phaseID) {
				this.$nuxt.$loading.start();
				this.devicesFetching = phaseID;
				await this.$axios
					.get("phase/" + phaseID + "/devices")
					.then(({ status, data }) => {
						if (status === 200) {
							const devices = data.devices;
							console.log(
								"DEVICES on Phase #" + phaseID + ": ",
								devices
							);

							this.devices = devices;
							this.devicesFetching = false;
						}
					})
					.catch((error) => {
						console.log("ERROR: ", error);
						this.devicesFetching = false;
					});
			},
			async getPhases(pageID) {
				this.$nuxt.$loading.start();
				this.devices = [];
				this.phasesFetching = pageID;
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
					.catch((error) => {
						console.log("ERROR: ", error);
						this.phasesFetching = false;
					});
			},
		},
		computed: {
			ownerInfo() {
				const user_ID = this.blockData.user_ID;
				return this.userInfo(user_ID);
			},
		},
		props: {
			blockData: {
				type: Object,
			},
		},
	};
</script>

<style lang="scss">
	.card {
		display: inline-flex;
		flex-direction: column;
		justify-content: space-between;
		background-color: white;
		width: 100%;
		height: 100%;
		min-height: 250px;
		border-radius: 6px;
		border: 1px solid #eaedf3;
		box-shadow: 0px 2px 14px #edf1fa;

		& > .top {
			position: relative;
			display: flex;
			flex: 1;
			height: 165px;
			padding: 12px;
			background-color: #0e1117;
			background-size: cover;
			background-repeat: no-repeat;
			color: white;
			border-top-left-radius: 6px;
			border-top-right-radius: 6px;
			box-shadow: inset 0px 12px 18px rgba(0, 0, 0, 0.02);

			&::before {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: #1d222f;
				opacity: 0.5;
				border-top-left-radius: inherit;
				border-top-right-radius: inherit;
			}

			& > .actions {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(29, 34, 47, 0.5);
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 12px 14px;
				opacity: 0;
				transition: 500ms;
				border-top-left-radius: inherit;
				border-top-right-radius: inherit;

				& > * {
					display: flex;
					justify-content: space-between;
					align-items: center;

					& > * {
						display: flex;
						flex-direction: row;
						align-items: center;
					}
				}

				.multiple-profiles {
					cursor: pointer;

					& + .share {
						margin-left: 10px;
					}
				}

				details.block-actions summary {
					display: flex;
					align-items: center;
					height: 15px;
				}

				.versions-list {
					svg:not(.caret-right) {
						path {
							stroke: #78808b;
						}
					}
				}
			}

			& > .status {
				position: absolute;
				top: 20px;
				right: 15px;
			}
		}

		& > .info {
			padding: 20px 20px 10px;

			.title {
				color: #2d3137;
				font-size: 18px;
				line-height: 21px;
				font-weight: 600;
				margin-bottom: 0;

				& > a {
					display: flex;
					flex-direction: row;

					& > .text {
						position: relative;
						height: 1.2em;
						flex: 1;

						& > span {
							position: absolute;
							overflow: hidden;
							white-space: nowrap;
							height: 1.2em;
							text-overflow: ellipsis;
							width: 100%;
						}
					}

					& > .count {
						color: #b0b0b0;
						font-size: 15px;
					}
				}
			}

			.description {
				display: none;
				color: #78808b;
				font-size: 15px;
				line-height: 20px;
				position: relative;
				height: 1.2em;

				& > span {
					position: absolute;
					overflow: hidden;
					white-space: nowrap;
					height: 1.2em;
					text-overflow: ellipsis;
					width: 100%;
				}
			}
		}

		& > .bottom {
			display: flex;
			justify-content: space-between;
			padding: 0px 20px 14px;
			color: #a1a1a1;

			.date {
				font-size: 10px;
				line-height: normal;
				font-weight: 500;
				text-transform: uppercase;
			}

			.favorite {
				margin-right: 3px;
				cursor: pointer;
				opacity: 0;
				transition: 500ms;
			}
		}

		&:hover {
			box-shadow: 0px 3px 24px #e0eafb;

			& > .top {
				& > .actions {
					opacity: 1;
				}

				& > .status {
					opacity: 0;
				}
			}

			& > .bottom {
				& > .favorite {
					opacity: 1;
				}
			}
		}
	}
</style>
