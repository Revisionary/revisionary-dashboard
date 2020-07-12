<template>
	<header id="sub-header" :class="{ loading: isLoading }">
		<div class="left">
			<figure
				class="thumbnail"
				v-if="dataType !== 'project'"
				:style="'background-image: url(' + thumbnail + ');'"
			>
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
			</figure>
			<div class="info">
				<div class="subtitle">{{ isLoading ? 'Loading...' : subtitle }}</div>

				<div class="title">
					<details class="unselectable-when-loading">
						<summary class="rotate-icon">
							<h1>
								<span>
									<span v-html="title"></span>
									<ChevronDownIcon />
								</span>
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
				</div>

				<p class="description">
					<span v-html="blockData.description"></span>
				</p>
			</div>
		</div>
		<div class="right" v-if="$route.name !== 'projects' && $route.name !== 'projects-category'">
			<div class="subtitle" style="opacity: 0;">.</div>
			<div class="shares">
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
			<div class="page-info">
				<span>
					Created
					<strong>{{ $timeSince(blockData.date_created) }} ago</strong>, last modified
					<strong>{{ $timeSince(blockData.date_modified) }} ago</strong>
				</span>
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

			<div class="actions">
				<a
					href="#"
					class="tooltip-not-contained"
					:data-tooltip="'Search in ' + ($route.name == 'projects' || $route.name == 'projects-category' ? 'Projects' : 'Pages')"
				>
					<SearchIcon />
				</a>
				<a href="#" class="tooltip-not-contained" data-tooltip="Settings">
					<SortIcon />
				</a>
				<a href="#" class="dark" data-tooltip="Add New Project">
					<PlusIcon />
				</a>
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
			InfoIcon
		},
		props: {
			dataType: {
				type: String
			}
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
					block => !block.archived && !block.deleted
				).length;

				if (this.$route.params.category == "archived")
					availableCount = this.blocksData.filter(block => block.archived)
						.length;

				if (this.$route.params.category == "deleted")
					availableCount = this.blocksData.filter(block => block.deleted)
						.length;

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
					category => category.slug == this.$route.params.category
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
					return "Projects" + this.dataCount;
				else return this.blockData.title + this.dataCount;
			},
			description() {
				if (this.isLoading) return "Loading...";
				else if (this.dataType == "project") return "";
				else return this.blockData.description;
			}
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
			}
		}
	};
</script>

<style lang="scss">
	#sub-header {
		position: relative;
		padding-bottom: 70px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		& > .left {
			display: flex;
		}

		& > .right {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: flex-end;
		}

		h1 {
			font-size: 30px;
			line-height: 36px;
			font-weight: 600;
			letter-spacing: -0.3px;
			color: #2d3137;

			& > span {
				display: inline-flex;
				align-items: center;

				& > svg {
					margin-left: 4px;
					margin-top: 5px;
				}
			}
		}

		.thumbnail {
			width: 80px;
			height: 80px;
			background-color: #78808b;
			margin-right: 20px;
			border-radius: 20px;
			border: 1px solid #eaedf3;
			background-size: cover;
			background-repeat: no-repeat;
			background-position: 0 0;
			position: relative;

			.tasks-count {
				position: absolute;
				top: -10px;
				right: 0;

				& > * {
					border-color: white;
				}
			}
		}

		.title {
			display: flex;
			align-items: center;

			& > .project-actions {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-left: 15px;
				margin-bottom: -4px;

				& > * {
					padding: 0 5px;
					cursor: pointer;

					& > * {
						display: block;
						width: 15px;
					}
				}
			}

			h1 {
				svg > path {
					stroke: #a4a6ac;
				}
			}
		}

		.subtitle {
			font-style: normal;
			font-weight: bold;
			font-size: 14px;
			line-height: 17px;
			letter-spacing: -0.3px;
			color: #9f9f9f;
			text-transform: uppercase;
			margin-bottom: 2px;
		}

		.description {
			font-weight: normal;
			font-size: 17px;
			line-height: 23px;
			color: #78808b;
			margin-top: 0;
			margin-bottom: 0;
		}

		.shares {
			justify-content: flex-end;

			.multiple-profiles > * + * > picture {
				margin-left: -12px;
			}

			.owner,
			.shared {
				& > picture {
					width: 34px;
					height: 34px;
					font-size: 14px;
					border-color: white;
					border-width: 3px;
				}
			}

			button {
				border-color: #c3cad8;
				color: #9199b1 !important;
				text-transform: uppercase;
				border-radius: 10px;
				height: 30px;
				margin-left: 8px;
				padding: 0 12px;
				padding-left: 10px;
				font-size: 12px;
				line-height: 14px;

				& > svg > path {
					stroke: #7884a7;
				}
			}
		}

		.page-info {
			color: #747781;
			font-weight: 500;
			font-size: 12px;
			letter-spacing: -0.5px;
			line-height: 17px;
			margin-top: 8px;
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

		& > .bottom {
			position: absolute;
			left: 0;
			right: 0;
			bottom: -1px;
			padding: 0 55px;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;

			.tabs {
				& > a {
					color: #9296a0;
					font-size: 13px;
					line-height: 16px;
					font-weight: 400;
					letter-spacing: 0.1px;
					text-transform: uppercase;
					display: inline-block;
					padding-bottom: 14px;
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

			.actions {
				transform: translateY(50%);
				display: flex;

				& > a {
					display: inline-flex;
					justify-content: center;
					align-items: center;
					width: 39px;
					height: 39px;
					border-radius: 50%;
					border: 1px solid #e6e6e6;
					background-color: #fff;
					box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.06);
					margin-left: 16px;
					transition: 500ms;

					&.dark {
						background-color: $color-primary;
					}

					&:hover {
						box-shadow: none;
					}
				}
			}
		}
	}

	@keyframes gradientBG {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
