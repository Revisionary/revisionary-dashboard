<template>
	<details class="jump-to" :open="jumperOpen ? true : null">
		<summary class="selectbox" @click.prevent="checkData">
			<span class="current">{{ current }}</span>
			<CaretDownIcon />
		</summary>
		<div class="details-menu">
			<ul>
				<li :class="{active : this.$route.name === 'index'}" v-if="this.$route.name !== 'index'">
					<nuxt-link to="/">All Projects</nuxt-link>
				</li>
				<li
					v-for="eachProject in projects"
					v-bind:key="eachProject.id"
					:class="{active : project.id == eachProject.id}"
				>
					<nuxt-link :to="`/project/${eachProject.id}`">{{ eachProject.title.substr(0, 15) }}</nuxt-link>
				</li>
			</ul>
		</div>
	</details>
</template>

<script>
	import { mapGetters } from "vuex";
	import CaretDownIcon from "~/components/atoms/icon-caret-down.vue";

	export default {
		components: {
			CaretDownIcon
		},
		computed: {
			...mapGetters({
				projects: "projects/get",
				project: "projects/getProject",
				isLoaded: "projects/status"
			}),
			current() {
				if (
					this.$route.name === "project-id" &&
					typeof this.project.title !== "undefined"
				)
					return this.project.title.substr(0, 15);

				return "Jump to...";
			}
		},
		methods: {
			checkData() {
				if (this.jumperOpen) this.jumperOpen = false;
				else {
					if (!this.projects.length && !this.jumperOpen)
						this.$store.dispatch("projects/get");

					this.jumperOpen = true;
				}
			}
		},
		data() {
			return {
				jumperOpen: false
			};
		}
	};
</script>

<style lang="scss">
	.jump-to {
		margin-left: 120px;

		.current {
			text-transform: capitalize;
		}

		.details-menu {
			background-color: #fff;
			border: 1px solid #eaedf3;
			border-radius: 4px;
			padding: 8px 0;
			margin-top: 5px;

			& > ul {
				list-style-type: none;
				padding: 0;

				& > li {
					& > a {
						font-size: 15px;
						line-height: 18px;
						font-weight: 500;
						display: block;
						padding: 8px 12px;
						text-transform: capitalize;
					}

					&.active {
						& > a {
							font-weight: 600;
							color: #333333 !important;
							//background-color: red;
						}
					}
				}
			}
		}
	}
</style>
