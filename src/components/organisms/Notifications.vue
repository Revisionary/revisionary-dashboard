<template>
	<ul class="notifications-wrapper">
		<li v-if="fetching">Loading...</li>
		<li v-if="!notifications.length && !fetching">No notifications yet.</li>

		<li
			class="notification"
			:class="{new : !notification.isRead}"
			v-for="notification in notifications"
			:key="notification.ID"
			:id="'notification-' + notification.ID"
		>
			<div class="user">
				<ProfilePic
					:firstName="notification.first_name"
					:lastName="notification.last_name"
					:picture="notification.picture"
					:email="notification.email"
					:tooltip="false"
				/>
			</div>
			<div class="content">
				<div class="subject">
					<b>{{ notification.first_name }} {{ notification.last_name }}</b>

					<span v-if="notification.type == 'new'">added:</span>
					<span v-else-if="notification.type == 'complete'">completed:</span>
					<span v-else-if="notification.type == 'incomplete'">marked incomplete:</span>
					<span v-else-if="notification.type == 'comment'">wrote:</span>
					<span v-else-if="notification.type == 'share'">shared:</span>
					<span v-else-if="notification.type == 'unshare'">unshared:</span>
					<span v-else>{{ notification.notification }}</span>
				</div>

				<div class="info">
					<span v-if="notification.type == 'new'">
						Task #{{ notification.notification }} on
						<span>
							<nuxt-link :to="'/revise/' + notification.device_ID" v-if="notification.page_name">
								<span>{{ notification.page_name }}</span>
								<span v-if="notification.project_name">[{{ notification.project_name }}]</span>
							</nuxt-link>
						</span>
					</span>
					<span v-else-if="notification.type == 'complete'">
						Task #{{ notification.notification }} on
						<span>
							<nuxt-link :to="'/revise/' + notification.device_ID" v-if="notification.page_name">
								<span>{{ notification.page_name }}</span>
								<span v-if="notification.project_name">[{{ notification.project_name }}]</span>
							</nuxt-link>
						</span>
					</span>
					<span v-else-if="notification.type == 'incomplete'">
						Task #{{ notification.notification }} on
						<span>
							<nuxt-link :to="'/revise/' + notification.device_ID" v-if="notification.page_name">
								<span>{{ notification.page_name }}</span>
								<span v-if="notification.project_name">[{{ notification.project_name }}]</span>
							</nuxt-link>
						</span>
					</span>
					<span v-else-if="notification.type == 'comment'">
						<i>"{{ notification.pin_comment != null ? notification.pin_comment : notification.notification }}..."</i>
						<div>
							on
							<span>
								<nuxt-link :to="'/revise/' + notification.device_ID" v-if="notification.page_name">
									<span>{{ notification.page_name }}</span>
									<span v-if="notification.project_name">[{{ notification.project_name }}]</span>
								</nuxt-link>
							</span>
						</div>
					</span>
					<span v-else-if="notification.type == 'share'">
						<span v-if="notification.project_name && !notification.page_name">
							<nuxt-link :to="'/project/' + notification.project_ID">{{ notification.project_name }}</nuxt-link>Project
						</span>
						<span v-if="notification.page_name">
							<nuxt-link :to="'/project/' + notification.project_ID">
								{{ notification.page_name }}
								<span
									v-if="notification.project_name"
								>[{{ notification.project_name }}]</span>
							</nuxt-link>Page
						</span>
					</span>
					<span v-else-if="notification.type == 'unshare'">
						<i>{{ notification.notification }}</i>
					</span>
					<span v-else>{{ notification.notification }}</span>
				</div>

				<div class="date">
					<TimeIcon />
					{{ $timeSince(notification.time) }}
				</div>
			</div>
		</li>

		<li v-if="hasMore">
			<button
				class="full transparent-big"
				@click="fetch(page + 1)"
				:disabled="fetching"
			>{{ fetching ? 'Loading...' : 'Load More Notifications' }}</button>
		</li>
	</ul>
</template>

<script>
	import TimeIcon from "~/components/atoms/icon-time.vue";
	import ProfilePic from "~/components/atoms/ProfilePic.vue";

	export default {
		components: {
			ProfilePic,
			TimeIcon,
		},
		data() {
			return {
				notifications: [],
				page: 1,
				totalNotifications: 0,
				fetching: false,
			};
		},
		computed: {
			hasMore() {
				return this.notifications.length < this.totalNotifications;
			},
		},
		methods: {
			async fetch(page = 1) {
				this.$nextTick(() => {
					this.$nuxt.$loading.start();
				});
				this.fetching = true;

				await this.$axios
					.get("notifications/" + page)
					.then(({ status, data }) => {
						if (status === 200) {
							const notifications = data.notifications;
							const total = data.totalCount;
							console.log(
								"NOTIFICATIONS (Page: " + page + "): ",
								notifications,
								total
							);

							if (page == 1) this.notifications = notifications;
							else
								this.notifications = [
									...this.notifications,
									...notifications,
								];

							this.totalNotifications = total;

							// Scroll
							if (notifications.length) {
								this.$nextTick(() => {
									if (
										typeof document.getElementById(
											"notification-" + notifications[0].ID
										) !== "undefined" &&
										document.getElementById(
											"notification-" + notifications[0].ID
										) !== null
									)
										document
											.getElementById(
												"notification-" +
													notifications[0].ID
											)
											.scrollIntoView(false);
								});
							}

							this.page = page;
							this.fetching = false;

							// Read Notifications
							const unread_IDs = notifications
								.filter((notification) => !notification.isRead)
								.map(function (value, index) {
									return value["ID"];
								});

							if (unread_IDs.length) {
								console.log("Unread Notifications: ", unread_IDs);
								this.read(unread_IDs);
							}
						}
					})
					.catch(function (error) {
						console.log("ERROR: ", error);
						this.fetching = false;
					});
			},

			async read(IDs) {
				await this.$axios
					.post("readnotifications", {
						IDs: IDs,
					})
					.then(({ status, data }) => {
						if (status === 200) {
							console.log("Notifications Marked Read: ", IDs);

							// Decrease the unread count in store
							const currentCount = this.$store.state
								.newNotificationsCount;

							this.$store.commit(
								"setNotificationsCount",
								currentCount - IDs.length
							);
						}
					})
					.catch(function (error) {
						console.log("ERROR: ", error);
					});
			},
		},
		created() {
			console.log("NOTIFICATIONS CREATED! ");
			this.fetch();
		},
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
						color: $color-primary;
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
