<template>
	<header id="sub-header" :class="{ loading: isLoading }">
		<div class="top">
			<div class="left">
				<details class="unselectable-when-loading title">
					<summary class="rotate-icon">
						<h1>
							<span v-html="title"></span>
							<ChevronDownIcon />
						</h1>
					</summary>
					<div class="details-menu left">
						<ul class="menu boxed">
							<li :class="{ active: $route.params.category == null }">
								<nuxt-link
									:to="currentPath + '/'"
								>All {{ $route.name == 'projects' || $route.name == 'projects-category' ? 'Projects' : 'Pages' }} ({{ blocksData.filter(block => !block.archived && !block.deleted).length }})</nuxt-link>
							</li>
							<li :class="{ active: $route.params.category == 'archived' }">
								<nuxt-link
									:to="currentPath + '/archived/'"
								>Archived {{ $route.name == 'projects' || $route.name == 'projects-category' ? 'Projects' : 'Pages' }} ({{ blocksData.filter(block => block.archived).length }})</nuxt-link>
							</li>
							<li :class="{ active: $route.params.category == 'deleted' }">
								<nuxt-link
									:to="currentPath + '/deleted/'"
								>Deleted {{ $route.name == 'projects' || $route.name == 'projects-category' ? 'Projects' : 'Pages' }} ({{ blocksData.filter(block => block.deleted).length }})</nuxt-link>
							</li>
						</ul>
					</div>
				</details>

				<div
					class="project-actions"
					v-if="$route.name !== 'projects' && $route.name !== 'projects-category'"
				>
					<div class="edit-project" data-tooltip="Edit Project">
						<InfoIcon />
					</div>
					<div
						class="favorite"
						:data-tooltip="blockData.favorite ? 'Remove from Favorites' : 'Add to Favorites'"
						@click="toggleFavorite"
					>
						<StarIcon :active="blockData.favorite" />
					</div>
				</div>

				<div class="tasks-count" v-if="blockData.incomplete_tasks > 0 || blockData.complete_tasks > 0">
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
			</div>
			<div class="right">
				<div class="shares" v-if="$route.name !== 'projects' && $route.name !== 'projects-category'">
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
					<button class="transparent with-icon share">
						<ShareIcon />Share
					</button>
				</div>

				<div class="actions">
					<a
						href="#"
						class="tooltip-not-contained bottom-tooltip"
						:data-tooltip="'Search in ' + ($route.name == 'projects' || $route.name == 'projects-category' ? 'Projects' : 'Pages')"
					>
						<SearchIcon />
					</a>
					<a href="#" class="tooltip-not-contained bottom-tooltip" data-tooltip="Settings">
						<SortIcon />
					</a>
					<a href="#" class="dark tooltip-not-contained left-tooltip" data-tooltip="Add New Project">
						<PlusIcon />
					</a>
				</div>
			</div>
		</div>

		<div class="bottom">
			<div class="tabs">
				<nuxt-link :to="currentPath + '/'">ALL</nuxt-link>
				<nuxt-link :to="currentPath + '/mine/'">MINE</nuxt-link>
				<nuxt-link :to="currentPath + '/shared/'">SHARED</nuxt-link>
				<nuxt-link :to="currentPath + '/favorites/'">FAVORITES</nuxt-link>

				<nuxt-link
					v-for="category in blockCategories.filter(category => category.ID != 0 )"
					:key="category.ID"
					:to="currentPath + '/' + category.slug + '/'"
				>{{ category.title }}</nuxt-link>

				<a
					href="#"
					style="font-size: 15px;"
					class="tooltip-not-contained"
					data-tooltip="Create a Category"
				>+</a>
			</div>

			<div class="page-info" v-if="$route.name !== 'projects' && $route.name !== 'projects-category'">
				<span>
					Created
					<strong>{{ $timeSince(blockData.date_created) }} ago</strong>, last modified
					<strong>{{ $timeSince(blockData.date_modified) }} ago</strong>
				</span>
			</div>
		</div>
	</header>
</template>

<script>
	import ChevronDownIcon from "~/components/atoms/icon-chevron-down.vue";
	import SearchIcon from "~/components/atoms/icon-search.vue";
	import SortIcon from "~/components/atoms/icon-sort.vue";
	import StarIcon from "~/components/atoms/icon-star.vue";
	import PlusIcon from "~/components/atoms/icon-plus.vue";
	import ShareIcon from "~/components/atoms/icon-share.vue";
	import InfoIcon from "~/components/atoms/icon-info.vue";

	import ProfilePic from "~/components/atoms/ProfilePic.vue";

	export default {
		components: {
			ChevronDownIcon,
			SearchIcon,
			SortIcon,
			StarIcon,
			PlusIcon,
			ProfilePic,
			ShareIcon,
			InfoIcon,
		},
		props: {
			dataType: {
				type: String,
			},
		},
		computed: {
			currentPath() {
				if (this.dataType == "project") return "/projects";
				return "/project/" + this.$route.params.id;
			},
			blockData() {
				if (this.dataType == "project") return [];
				return this.$store.getters["projects/getProject"];
			},
			blockCategories() {
				if (this.dataType == "project")
					return this.$store.getters["projects/getCategories"];
				return this.$store.getters["pages/getCategories"];
			},
			blocksData() {
				if (this.dataType == "project")
					return this.$store.getters["projects/get"];
				return this.$store.getters["pages/get"];
			},
			dataCount() {
				let availableCount = this.blocksData.filter(
					(block) => !block.archived && !block.deleted
				).length;

				if (this.$route.params.category == "archived")
					availableCount = this.blocksData.filter(
						(block) => block.archived
					).length;

				if (this.$route.params.category == "deleted")
					availableCount = this.blocksData.filter(
						(block) => block.deleted
					).length;

				if (availableCount) return " (" + availableCount + ")";
				return "";
			},
			ownerInfo() {
				return this.userInfo(this.blockData.user_ID);
			},
			isLoading() {
				if (this.dataType == "project")
					return this.$store.getters["projects/status"];
				return this.$store.getters["pages/status"];
			},
			thumbnail() {
				return this.blockData.image_url;
			},
			subtitle() {
				if (this.isLoading) return "Loading...";

				if (this.$route.params.category == "favorites") return "Favorite";

				const foundCat = this.blockCategories.find(
					(category) => category.slug == this.$route.params.category
				);
				if (this.$route.params.category != null && foundCat)
					return foundCat.title;

				if (this.$route.params.category != null)
					return this.$route.params.category;

				if (this.dataType == "project") return "Hub";
				return "Project";
			},
			title() {
				if (this.isLoading) return "Loading...";
				else if (this.dataType == "project")
					return "My Projects" + this.dataCount;
				else return this.blockData.title + this.dataCount;
			},
			description() {
				if (this.isLoading) return "Loading...";
				else if (this.dataType == "project") return "";
				else return this.blockData.description;
			},
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

				// if (!foundUser) {
				// 	this.$store.dispatch("users/fetch", [ID]);
				// 	foundUser = this.$store.getters["users/getUser"](ID);
				// }

				return foundUser;
			},
		},
	};
</script>

<style lang="scss">
	#sub-header {
		position: relative;
		height: 95px;
		padding: 0 36px;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 30px;
		justify-content: space-between;
		background-color: #fff;
		border-bottom: 1px solid #eaedf3;

		& > .top {
			display: flex;
			align-items: center;
			justify-content: space-between;

			& > .left {
				display: grid;
				grid-auto-flow: column;
				align-items: center;
				gap: 15px;
			}

			& > .right {
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}
		}

		& > .bottom {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
		}

		h1 {
			font-size: 18px;
			line-height: 21px;
			font-weight: 600;
			letter-spacing: -0.3px;
			color: #2d3137;
			display: inline-flex;
			align-items: center;

			& > svg {
				margin-left: 4px;
				margin-top: 5px;

				& > path {
					stroke: #a4a6ac;
				}
			}
		}

		.project-actions {
			display: grid;
			grid-auto-flow: column;
			align-items: center;
			gap: 10px;

			& > * {
				cursor: pointer;

				& > * {
					display: block;
					width: 15px;
				}
			}
		}

		.tasks-count {
			border-left: 1px solid #ededed;
			padding-left: 15px;

			& > * {
				border-color: white;

				&.done {
					background-color: #78808b;
				}
			}
		}

		.shares {
			justify-content: flex-end;
			padding-right: 20px;
			border-right: 1px solid #e7e7e7;
			margin-right: 20px;

			.multiple-profiles > * + * > picture {
				margin-left: -12px;
			}

			.owner,
			.shared {
				& > picture {
					width: 27px;
					height: 27px;
					font-size: 12px;
					border-color: white;
					border-width: 3px;
				}
			}

			button {
				background-color: $color-green;
				color: white !important;
				text-transform: uppercase;
				border-radius: 30px;
				height: 30px;
				margin-left: 8px;
				padding: 0 12px;
				padding-left: 10px;
				font-weight: 600;
				font-size: 11px;
				line-height: 13px;

				& > svg > path {
					stroke: white;
				}

				&:hover {
					opacity: 0.6;
				}
			}
		}

		.page-info {
			color: #747781;
			font-weight: 500;
			font-size: 12px;
			letter-spacing: -0.5px;
			line-height: 17px;
			opacity: 0.7;

			& > strong {
				color: #2d3037;
			}
		}

		&.loading {
			.project-actions {
				display: none;
			}

			.thumbnail,
			h1,
			.description,
			.shares,
			.page-info {
				text-indent: 9999px;
				white-space: nowrap;
				overflow: hidden;
				background-image: linear-gradient(
					90deg,
					#9ea5ab,
					rgb(230, 230, 230),
					#9ea5ab
				) !important;
				background-size: 300% 100%;
				animation: gradientBG 3s ease infinite;

				border-radius: 3px;
				width: 200px;
				color: transparent;
				opacity: 0.2;
				pointer-events: none;

				& > * {
					opacity: 0;
				}
			}

			.thumbnail {
				width: 80px;
				border-radius: 20px;
			}

			.description {
				width: 500px;
			}

			.page-info {
				width: 280px;
			}

			.unselectable-when-loading {
				pointer-events: none;
			}
		}

		.actions {
			display: grid;
			grid-auto-flow: column;
			gap: 10px;

			& > a {
				display: inline-flex;
				justify-content: center;
				align-items: center;
				width: 30px;
				height: 30px;
				border-radius: 50%;
				background-color: #f1f1f1;
				transition: 500ms;

				& > svg {
					width: 10px;
					display: block;
				}

				&.dark {
					background-color: $color-primary;
				}

				&:hover {
					opacity: 0.6;
				}
			}
		}

		.tabs {
			& > a {
				color: #9296a0;
				font-weight: 600;
				font-size: 12px;
				line-height: 13px;
				letter-spacing: 0.1px;
				text-transform: uppercase;
				display: inline-block;
				padding-bottom: 12px;
				margin-right: 20px;
				border-bottom: 1px solid transparent;

				&.nuxt-link-exact-active {
					color: #4d5058;
					font-weight: 600;
					border-color: $color-primary;
				}

				&:hover {
					border-color: $color-primary;
				}
			}
		}
	}
</style>
