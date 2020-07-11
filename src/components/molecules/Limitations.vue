<template>
	<details class="plan-limitations">
		<summary>Free Plan</summary>
		<div class="details-menu center">
			<ul class="menu boxed">
				<li class="title">
					<span>Limitations</span>
				</li>
				<li>
					<span>
						<span class="left">Projects</span>
						<span class="right">{{ countProjects }}/{{ currentUser.max_projects }}</span>
					</span>
				</li>
				<li>
					<span>
						<span class="left">Pages/Phases</span>
						<span class="right">4/{{ currentUser.max_pages }}</span>
					</span>
				</li>
				<li>
					<span>
						<span class="left">Screens</span>
						<span class="right">4/{{ currentUser.max_screens }}</span>
					</span>
				</li>
				<li>
					<span>
						<span class="left">Live Pins</span>
						<span class="right">4/{{ currentUser.max_live_pins }}</span>
					</span>
				</li>
				<li>
					<span>
						<span class="left">Comment Pins</span>
						<span class="right">4/{{ currentUser.max_comment_pins }}</span>
					</span>
				</li>
				<li>
					<span>
						<span class="left">MB Files</span>
						<span class="right">14.2/{{ currentUser.max_load }}</span>
					</span>
				</li>
			</ul>
		</div>
	</details>
</template>

<script>
	export default {
		methods: {
			fetchUsage() {}
		},
		computed: {
			currentUser() {
				return this.$auth.user;
			},
			countProjects() {
				const myProjects = this.$store.getters["projects/get"].filter(
					project => project.user_ID == this.currentUser.ID
				);

				return myProjects.length;
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
