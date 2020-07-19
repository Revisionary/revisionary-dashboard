<template>
	<div
		class="card add-new"
		:class="{open: isOpen, blocked: !isAvailable}"
		v-if="filter != 'shared' && filter != 'mine' && filter != 'favorites' && filter != 'archived' && filter != 'deleted'"
	>
		<div class="top" @click.prevent="toggleAddNew">
			<div class="add-new-opener">
				<PlusIconLarge />
				<br />
				Add New {{ dataType }}
				<div class="category" v-if="filter !== null || cat_ID != 0">Into '{{ category }}' Category</div>
			</div>
		</div>
		<div class="info" v-show="isOpen">
			<form>
				<input ref="url" type="url" placeholder="Enter a website URL..." required />
				<button>
					<ChevronRightIcon />
				</button>
			</form>
			<p>
				or
				<a href="#">upload your page design</a>
				<span class="bottom-tooltip" data-tooltip="Some info here...">
					<QuestionIcon />
				</span>
			</p>
		</div>
		<div class="bottom" v-show="isOpen">Advanced Options</div>
		<div class="blocked" v-if="!isAvailable">
			<SadIcon />
			<p>
				YOU HAVE REACHED
				<br />THE
				<span class="underline">{{ limit }} {{ dataType.toUpperCase() }}S</span> LIMIT.
			</p>
			<a href="#" class="button upgrade">Upgrade Now</a>
		</div>
	</div>
</template>

<script>
	import PlusIconLarge from "~/components/atoms/icon-plus-large.vue";
	import ChevronRightIcon from "~/components/atoms/icon-chevron-right.vue";
	import QuestionIcon from "~/components/atoms/icon-question.vue";
	import SadIcon from "~/components/atoms/icon-sad.vue";

	export default {
		components: {
			PlusIconLarge,
			ChevronRightIcon,
			QuestionIcon,
			SadIcon
		},
		props: {
			cat_ID: {
				type: Number,
				required: true
			},
			cat_title: {
				type: String
			},
			filter: {
				type: String
			}
		},
		computed: {
			dataType() {
				if (
					this.$route.name == "projects" ||
					this.$route.name == "projects-category"
				)
					return "project";

				return "page";
			},
			blockCategories() {
				if (this.dataType == "project")
					return this.$store.getters["projects/getCategories"];
				return this.$store.getters["pages/getCategories"];
			},
			category() {
				if (this.filter !== null)
					return this.blockCategories.find(
						category => category.slug == this.filter
					).title;

				return this.cat_title;
			},
			limit() {
				if (this.dataType == "project") return this.$auth.user.max_projects;

				return this.$auth.user.max_phases;
			},
			isAvailable() {
				if (
					this.dataType == "project" &&
					this.$store.getters["projects/get"].length >=
						this.$auth.user.max_projects
				)
					return false;

				if (
					this.dataType == "project" &&
					this.$store.getters["pages/get"].length >=
						this.$auth.user.max_phases
				)
					return false;

				return true;
			}
		},
		methods: {
			toggleAddNew() {
				this.isOpen = !this.isOpen;

				const url = this.$refs.url;
				url.focus();

				setTimeout(function() {
					url.focus();
				}, 200);
			}
		},
		data() {
			return {
				isOpen: false
			};
		}
	};
</script>

<style lang="scss">
	.card.add-new {
		overflow: hidden;

		& > .top {
			height: 100%;
			background-color: #fff;
			color: black;
			justify-content: center;
			align-items: center;
			text-align: center;
			font-size: 15px;
			line-height: 18px;
			font-weight: 500;
			cursor: pointer;
			user-select: none;

			&::before {
				content: none;
			}

			.add-new-opener {
				text-transform: capitalize;

				svg {
					margin-bottom: 10px;
				}

				.category {
					font-weight: 300;
					font-size: 12px;
				}
			}
		}

		& > .info {
			box-shadow: inset 0px 12px 18px rgba(0, 0, 0, 0.02);
			font-weight: 500;
			font-size: 12px;
			line-height: 14px;
			color: #9e9e9e;
			letter-spacing: -0.1px;

			a {
				color: black;
				border-bottom: 1px solid #e0e0e0;
				padding-bottom: 2px;
			}

			p {
				margin-bottom: 20px;
			}

			form {
				display: flex;

				input {
					min-height: 35px;
					font-weight: normal;
					font-size: 12px;
					line-height: 14px;
					padding: 5px 12px;
					flex: 1;
				}

				button {
					width: 35px;
					height: 35px;
					margin-left: 10px;
					background: #f0f0f0;
					border: none;
				}
			}
		}

		& > .bottom {
			font-weight: 500;
			font-size: 12px;
			line-height: 14px;
			text-align: center;
			justify-content: center;
			align-items: center;
			cursor: pointer;
		}

		&.blocked {
			position: relative;

			& > .blocked {
				position: absolute;
				width: 100%;
				height: 100%;
				background-color: #34383b;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
				flex-direction: column;
				color: white;
				font-weight: 600;
				font-size: 15px;
				line-height: 18px;
				padding: 0 20px;

				& > p {
					margin: 20px 0 23px;

					.underline {
						padding-bottom: 3px;
						border-bottom: 1px solid #8b8e8f;
					}
				}
			}
		}
	}
</style>
