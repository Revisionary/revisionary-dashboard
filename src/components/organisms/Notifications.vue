<template>
	<ul class="notifications-wrapper">
		<li v-if="fetching">Loading...</li>
		<li
			class="notification"
			:class="{new : !notification.isRead}"
			v-for="notification in notifications"
			:key="notification.ID"
			:id="'notification-' + notification.ID"
		>
			<div class="user">
				<ProfilePic picture="https://www.bilaltas.net/wp-content/uploads/2013/02/duvar11-300x300.jpg" />
			</div>
			<div class="content">
				<div class="subject">
					{{ notification.ID }}
					<b>Bill Tas</b> completed a
					<b>live pin</b>:
				</div>
				<div class="info">
					on
					<span>
						<a href="#">Home[ThunderWear]</a>
					</span>
				</div>
				<div class="date">
					<TimeIcon />
					{{ $timeSince(notification.time) }}
				</div>
			</div>
		</li>

		<!-- <li class="notification new">
			<div class="user">
				<ProfilePic picture="https://www.bilaltas.net/wp-content/uploads/2013/02/duvar11-300x300.jpg" />
			</div>
			<div class="content">
				<div class="subject">
					<b>Bill Tas</b> completed a
					<b>live pin</b>:
				</div>
				<div class="info">
					on
					<span>
						<a href="#">Home[ThunderWear]</a>
					</span>
				</div>
				<div class="date">
					<TimeIcon />2 hours ago
				</div>
			</div>
		</li>
		<li class="notification new">
			<div class="user">
				<ProfilePic picture="https://www.bilaltas.net/wp-content/uploads/2013/02/duvar11-300x300.jpg" />
			</div>
			<div class="content">
				<div class="subject">
					<b>Bill Tas</b> completed a
					<b>live pin</b>:
				</div>
				<div class="info">
					on
					<span>
						<a href="#">Home[ThunderWear]</a>
					</span>
				</div>
				<div class="date">
					<TimeIcon />2 hours ago
				</div>
			</div>
		</li>
		<li class="notification">
			<div class="user">
				<ProfilePic picture="https://www.bilaltas.net/wp-content/uploads/2013/02/duvar11-300x300.jpg" />
			</div>
			<div class="content">
				<div class="subject">
					<b>Bill Tas</b> completed a
					<b>live pin</b>:
				</div>
				<div class="info">
					on
					<span>
						<a href="#">Home[ThunderWear]</a>
					</span>
				</div>
				<div class="date">
					<TimeIcon />2 hours ago
				</div>
			</div>
		</li>
		<li class="notification">
			<div class="user">
				<ProfilePic picture="https://www.bilaltas.net/wp-content/uploads/2013/02/duvar11-300x300.jpg" />
			</div>
			<div class="content">
				<div class="subject">
					<b>Bill Tas</b> completed a
					<b>live pin</b>:
				</div>
				<div class="info">
					on
					<span>
						<a href="#">Home[ThunderWear]</a>
					</span>
				</div>
				<div class="date">
					<TimeIcon />2 hours ago
				</div>
			</div>
		</li>-->

		<li v-if="hasMore">
			<button
				class="full transparent-big"
				@click="fetch(page + 1)"
				:disabled="fetching"
			>{{ fetching ? 'Loading...' : 'Load More Notifications - ' + (page + 1) }}</button>
		</li>
	</ul>
</template>

<script>
	import TimeIcon from "~/components/atoms/icon-time.vue";
	import ProfilePic from "~/components/atoms/ProfilePic.vue";

	export default {
		components: {
			ProfilePic,
			TimeIcon
		},
		data() {
			return {
				notifications: [],
				page: 1,
				totalNotifications: 0,
				fetching: false
			};
		},
		computed: {
			hasMore() {
				return this.notifications.length < this.totalNotifications;
			}
		},
		methods: {
			async fetch(page = 1) {
				this.fetching = true;

				await this.$axios
					.get("notifications/" + page)
					.then(({ status, data }) => {
						if (status === 200) {
							const notifications = data.notifications;
							const total = data.totalCount;
							console.log(
								"NOTIFICATIONS (" + page + "): ",
								notifications,
								total
							);

							if (page == 1) this.notifications = notifications;
							else
								this.notifications = [
									...this.notifications,
									...notifications
								];

							this.totalNotifications = total;

							// Scroll
							setTimeout(function() {
								document
									.getElementById(
										"notification-" + notifications[0].ID
									)
									.scrollIntoView(false);
							}, 200);

							this.page = page;
							this.fetching = false;
						}
					})
					.catch(function(error) {
						console.log("ERROR: ", error);
						this.fetching = false;
					});
			}
		},
		created() {
			this.fetch();
		}
	};
</script>

<style lang="scss">
	.notifications-wrapper {
		padding: 0;
		list-style-type: none;
		display: grid;
		gap: 22px;

		& > .notification {
			display: grid;
			grid-template-columns: 38px 1fr;
			gap: 10px;

			&.new {
				position: relative;

				& > .user > picture::after {
					content: "";
					width: 7px;
					height: 7px;
					background-color: #f39754;
					border: 2px solid white;
					box-sizing: content-box;
					border-radius: 50%;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					left: -18px;
				}
			}

			& > .user {
				picture {
					width: 38px;
					height: 38px;
				}
			}

			& > .content {
				font-size: 12px;
				line-height: 138.5%;
				font-weight: 500;
				color: #5f5f5f;
				//margin-top: -3px;

				& > .subject {
					b {
						color: #000;
						font-weight: 500;
					}
				}

				& > .info {
					a {
						color: #037ef3;
					}

					span {
						display: inline-block;
					}
				}

				& > .date {
					font-weight: normal;
					font-size: 12px;
					line-height: 16px;
					letter-spacing: 0.1px;
					color: #979595;
					margin-top: 3px;
					display: flex;
					align-items: center;

					svg {
						margin-right: 5px;
					}
				}
			}
		}
	}
</style>
