<template>
	<ul class="usage">
		<li>
			<span>
				<span class="left">Projects</span>
				<span class="right">
					<LoadingIcon v-if="fetching" />
					<span v-else>{{ usage.projects }}/{{ maxProjects }}</span>
				</span>
			</span>
		</li>
		<li>
			<span>
				<span class="left">Pages and Phases</span>
				<span class="right">
					<LoadingIcon v-if="fetching" />
					<span v-else>{{ usage.phases }}/{{ maxPages }}</span>
				</span>
			</span>
		</li>
		<li>
			<span>
				<span class="left">Screens</span>
				<span class="right">
					<LoadingIcon v-if="fetching" />
					<span v-else>{{ usage.devices }}/{{ maxScreens }}</span>
				</span>
			</span>
		</li>
		<li>
			<span>
				<span class="left">Live Pins</span>
				<span class="right">
					<LoadingIcon v-if="fetching" />
					<span v-else>{{ usage.livePins }}/{{ maxLivePins }}</span>
				</span>
			</span>
		</li>
		<li>
			<span>
				<span class="left">Comment Pins</span>
				<span class="right">
					<LoadingIcon v-if="fetching" />
					<span v-else>{{ usage.commentPins }}/{{ maxCommentPins }}</span>
				</span>
			</span>
		</li>
		<li>
			<span>
				<span class="left">MB Files</span>
				<span class="right">
					<LoadingIcon v-if="fetching" />
					<span v-else>{{ usage.load }}/{{ currentUser.max_load }}</span>
				</span>
			</span>
		</li>
	</ul>
</template>

<script>
	import LoadingIcon from "~/components/atoms/icon-loading.vue";

	export default {
		components: {
			LoadingIcon,
		},
		data() {
			return {
				fetching: false,
				usage: {
					projects: 0,
					pages: 0,
					phases: 0,
					devices: 0,
					livePins: 0,
					commentPins: 0,
				},
			};
		},
		props: {
			label: {
				type: String,
				default: "",
			},
		},
		methods: {
			async fetchUsage() {
				this.fetching = true;

				this.$nextTick(() => {
					this.$nuxt.$loading.start();
				});

				await this.$axios
					.get("usage")
					.then(({ status, data }) => {
						if (status === 200) {
							const usage = data.usage;
							console.log("USAGE: ", usage);

							this.usage = usage;
							this.fetching = false;
						}
					})
					.catch((error) => {
						console.log("ERROR: ", error);
						this.fetching = false;
					});
			},
		},
		computed: {
			currentUser() {
				return this.$auth.user;
			},
			maxProjects() {
				return this.currentUser.max_projects == "99999"
					? "∞"
					: this.currentUser.max_projects;
			},
			maxPages() {
				return this.currentUser.max_pages == "99999"
					? "∞"
					: this.currentUser.max_pages;
			},
			maxScreens() {
				return this.currentUser.max_screens == "99999"
					? "∞"
					: this.currentUser.max_screens;
			},
			maxLivePins() {
				return this.currentUser.max_live_pins == "99999"
					? "∞"
					: this.currentUser.max_live_pins;
			},
			maxCommentPins() {
				return this.currentUser.max_comment_pins == "99999"
					? "∞"
					: this.currentUser.max_comment_pins;
			},
		},
		created() {
			console.log("LIMITATIONS CREATED! ");
			this.fetchUsage();
		},
	};
</script>

<style lang="scss">
	ul.usage {
		& > li {
			& > span {
				.right {
					min-width: 80px;
					justify-content: flex-end;
					color: black;
				}
			}
		}
	}
</style>
