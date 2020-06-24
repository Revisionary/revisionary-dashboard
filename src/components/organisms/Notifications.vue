<template>
	<ul class="notifications-wrapper">
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
		created() {
			console.log("Notifications fetching...");
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
