<template>
	<div class="card">
		<div class="top" :style="'background-image: url(' + blockData.image_url + ');'">
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
							<span class="shared" v-for="(user_ID, index) in blockData.users" :key="user_ID">
								<ProfilePic
									v-if="index < 2"
									:firstName="userInfo(user_ID).first_name"
									:lastName="userInfo(user_ID).last_name"
									:picture="userInfo(user_ID).picture"
									:email="userInfo(user_ID).email"
								/>
								<ProfilePic
									v-if="index == 2"
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
						<details class="block-actions">
							<summary>
								<MoreIcon />
							</summary>
							<div class="details-menu sub-menu compact right">
								<ul>
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
								<div class="button rounded with-icon icon-right">
									OPEN
									<ChevronDownIcon />
								</div>
							</summary>
							<div class="details-menu sub-menu center compact lines">
								<ul>
									<li>
										<a href="#">
											<LaptopIcon />Custom (1544x780)
										</a>
									</li>
									<li>
										<a href="#">
											<DesktopIcon />Desktop (1544x780)
										</a>
									</li>
									<li>
										<a href="#">
											<TabletIcon />Tablet (1544x780)
										</a>
									</li>
									<li>
										<a href="#">
											<MobileIcon />Mobile (1544x780)
										</a>
									</li>
								</ul>
							</div>
						</details>
					</div>
					<div class="right"></div>
				</div>
				<div class="bottom">
					<div class="left" v-if="$route.name !== 'projects' && $route.name !== 'projects-category'">
						<details>
							<summary>
								<div class="button radius">
									<VersionIcon />v1
									<ChevronDownIcon />
								</div>
							</summary>
							<div class="details-menu sub-menu compact lines versions-list">
								<ul>
									<li>
										<a href="#">
											<VersionIcon />v1 (2 months ago)
										</a>
									</li>
									<li>
										<a href="#">
											<VersionIcon />v2 (1 week ago)
										</a>
									</li>
									<li>
										<a href="#">
											<VersionIcon />v3 (a day ago)
										</a>
									</li>
								</ul>
							</div>
						</details>
					</div>
					<div class="center"></div>
					<div class="right">
						<div class="tasks-count">
							<div
								class="left tooltip-not-contained"
								data-tooltip="Incomplete"
							>{{ blockData.incomplete_tasks }}</div>
							<div class="done tooltip-not-contained" data-tooltip="Solved">{{ blockData.complete_tasks }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="info">
			<div class="title">
				<nuxt-link :to="`/project/${blockData.ID}`">
					<span class="text">
						<span>{{ blockData.title }}</span>
					</span>
					<span
						class="count tooltip-not-contained"
						data-tooltip="Pages Count"
					>({{ blockData.sub_count }})</span>
				</nuxt-link>
			</div>
			<div class="description">
				<span>{{ blockData.description }}</span>
			</div>
		</div>
		<div class="bottom">
			<div
				class="date bottom-tooltip tooltip-not-contained"
				:data-tooltip="'Created ' + timeSince(blockData.date_created) + ' ago'"
			>{{ timeSince(blockData.date_modified) }} ago</div>
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
	import ChevronDownIcon from "~/components/atoms/icon-chevron-down.vue";

	import DesktopIcon from "~/components/atoms/devices/icon-desktop.vue";
	import LaptopIcon from "~/components/atoms/devices/icon-laptop.vue";
	import TabletIcon from "~/components/atoms/devices/icon-tablet.vue";
	import MobileIcon from "~/components/atoms/devices/icon-mobile.vue";

	import ProfilePic from "~/components/atoms/ProfilePic.vue";

	export default {
		components: {
			ArrowRightIcon,
			MoreIcon,
			StarIcon,
			VersionIcon,
			ShareIcon,
			ChevronDownIcon,
			DesktopIcon,
			LaptopIcon,
			TabletIcon,
			MobileIcon,
			ProfilePic
		},
		methods: {
			toggleFavorite() {
				const blockID = this.blockData.ID;
				const blockFavorite = this.blockData.favorite;

				this.$store.dispatch("projects/updateProject", {
					ID: blockID,
					name: "favorite",
					value: !blockFavorite
				});
			},
			userInfo(ID) {
				let foundUser = this.$store.getters["users/getUser"](ID);

				// if (!foundUser) {
				// 	this.$store.dispatch("users/fetch", [ID]);
				// 	foundUser = this.$store.getters["users/getUser"](ID);
				// }

				return foundUser;
			},
			timeSince(date) {
				date = new Date(date);

				// UTC
				var now = new Date();
				var seconds = Math.floor(
					(new Date(now.getTime() + now.getTimezoneOffset() * 60000) -
						date) /
						1000
				);

				var interval = Math.floor(seconds / 31536000);
				if (interval > 1) return interval + " years";
				if (interval == 1) return interval + " year";

				interval = Math.floor(seconds / 2592000);
				if (interval > 1) return interval + " months";
				if (interval == 1) return interval + " month";

				interval = Math.floor(seconds / 86400);
				if (interval > 1) return interval + " days";
				if (interval == 1) return interval + " day";

				interval = Math.floor(seconds / 3600);
				if (interval > 1) return interval + " hours";
				if (interval == 1) return interval + " hour";

				interval = Math.floor(seconds / 60);
				if (interval > 1) return interval + " minutes";
				if (interval == 1) return interval + " minute";

				//return Math.floor(seconds) + " seconds";
				return "in a minute";
			}
		},
		computed: {
			ownerInfo() {
				const user_ID = this.blockData.user_ID;
				return this.userInfo(user_ID);
			}
		},
		props: {
			blockData: {
				type: Object
			}
		},
		data() {
			return {};
		}
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
		min-height: 280px;
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
					svg {
						path {
							stroke: #78808b;
						}
					}
				}
			}
		}

		& > .info {
			padding: 20px;

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
					}
				}
			}

			.description {
				color: #78808b;
				font-size: 15px;
				line-height: 20px;
				position: relative;
				height: 1.2em;
				display: none;

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
			padding: 14px 20px;
			border-top: 1px solid #ececec;
			color: #a1a1a1;

			.date {
				font-size: 12px;
				line-height: normal;
				font-weight: 500;
				text-transform: uppercase;
			}

			.favorite {
				cursor: pointer;
			}
		}

		&:hover {
			box-shadow: 0px 3px 24px #e0eafb;

			& > .top {
				& > .actions {
					opacity: 1;
				}
			}
		}
	}
</style>
