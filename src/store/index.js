export const state = () => ({
	isSideBarOpen: true,
	openTab: null,
	fetching: false,
	pageLoading: false,
	notifications: [],
	notificationsPage: 1,
	totalNotifications: 0,
	newNotificationsCount: 0,
	notificationsFetching: false
});

export const getters = {

};

export const actions = {

	// Fetch Notifications
	async fetchNotifications({ commit }) {

		commit("setNotificationsFetching", true);

		await this.$axios.get('notifications').then(({ status, data }) => {
			if (status === 200) {

				const notifications = data.notifications;
				const total = data.totalCount;
				console.log('NOTIFICATIONS: ', notifications, total);

				commit('setNotifications', { notifications, total });
				commit("setNotificationsFetching", false);

			}
		}).catch(function (error) {

			console.log('ERROR: ', error);
			commit("setNotificationsFetching", false);

		});


	},


	// Check Notifications
	async checkNotifications({ commit }) {

		commit("setNotificationsFetching", true);

		await this.$axios.get('notifications/newcount', { progress: false }).then(({ status, data }) => {
			if (status === 200) {

				const count = data.new_count;
				console.log('NEW NOTIFICATIONS COUNT: ', count);

				commit("setNotificationsCount", count);
				commit("setNotificationsFetching", false);

			}
		}).catch(function (error) {

			console.log('ERROR: ', error);
			commit("setNotificationsFetching", false);

		});


	},

};

export const mutations = {
	setFetching(state, status) {
		state.fetching = status;
	},
	toggleSideBar(state, forceState = null) {
		state.isSideBarOpen = !state.isSideBarOpen;
		if (forceState !== null) state.isSideBarOpen = forceState;
	},
	toggleTab(state, tabName) {
		if (state.openTab == tabName) state.openTab = null;
		else state.openTab = tabName;
	},
	setNotificationsFetching(state, status) {
		state.notificationsFetching = status;
	},
	setNotifications(state, { notifications, total }) {
		state.notifications = notifications;
		state.totalNotifications = total;
	},
	setNotificationsCount(state, newCount) {
		state.newNotificationsCount = newCount;
	}
};
