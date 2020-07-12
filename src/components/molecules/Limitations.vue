<template>
	<details class="plan-limitations">
		<summary>
			<span @click="fetchUsage">Free Plan</span>
		</summary>
		<div class="details-menu center">
			<ul class="menu boxed">
				<li class="title">
					<span>Limitations</span>
				</li>
				<li>
					<span>
						<span class="left">Projects</span>
						<span class="right">{{ fetching ? "Loading" : usage.projects }}/{{ maxProjects }}</span>
					</span>
				</li>
				<li>
					<span>
						<span class="left">Pages and Phases</span>
						<span class="right">{{ fetching ? "Loading" : usage.phases }}/{{ maxPages }}</span>
					</span>
				</li>
				<li>
					<span>
						<span class="left">Screens</span>
						<span class="right">{{ fetching ? "Loading" : usage.devices }}/{{ maxScreens }}</span>
					</span>
				</li>
				<li>
					<span>
						<span class="left">Live Pins</span>
						<span class="right">{{ fetching ? "Loading" : usage.livePins }}/{{ maxLivePins }}</span>
					</span>
				</li>
				<li>
					<span>
						<span class="left">Comment Pins</span>
						<span class="right">{{ fetching ? "Loading" : usage.commentPins }}/{{ maxCommentPins }}</span>
					</span>
				</li>
				<li>
					<span>
						<span class="left">MB Files</span>
						<span class="right">{{ fetching ? "Loading" : usage.load }}/{{ currentUser.max_load }}</span>
					</span>
				</li>
			</ul>
		</div>
	</details>
</template>

<script>
	export default {
		data() {
			return {
				fetching: false,
				usage: {
					projects: 0,
					pages: 0,
					devices: 0,
					livePins: 0,
					commentPins: 0
				}
			};
		},
		methods: {
			async fetchUsage() {
				this.$nextTick(() => {
					this.$nuxt.$loading.start();
				});

				this.fetching = true;

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
					.catch(function(error) {
						console.log("ERROR: ", error);
						this.fetching = false;
					});
			}
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
			}
		}
	};
</script>

<style lang="scss">
	.plan-limitations {
		& > summary {
			text-transform: uppercase;
			border-bottom: 1px dashed;
			padding-bottom: 3px;
			font-weight: 500;

			&:hover {
				color: $color-primary;
			}
		}

		&[open] > summary {
			color: $color-primary;
		}

		.menu {
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
	}
</style>
