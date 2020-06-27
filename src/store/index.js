export const state = () => ({
	isSideBarOpen: true,
	openTab: null,
	fetching: false,
	pageLoading: false,
	notifications: [],
	newNotificationsCount: 0
});

export const getters = {

};

export const actions = {

	// Fetch Notifications
	async fetchNotifications({ commit }) {

		commit("setFetching", true);

		await this.$axios.get('notifications').then(({ status, data }) => {
			if (status === 200) {

				const notifications = data.notifications;
				console.log('NOTIFICATIONS: ', notifications);

				commit('setNotifications', notifications);
				commit("setFetching", false);

			}
		}).catch(function (error) {

			console.log('ERROR: ', error);
			commit("setFetching", false);

		});


	},


	// Check Notifications
	async checkNotifications({ commit }) {

		commit("setFetching", true);

		await this.$axios.get('notifications/newcount', { progress: false }).then(({ status, data }) => {
			if (status === 200) {

				const count = data.new_count;
				console.log('NEW NOTIFICATIONS COUNT: ', count);

				commit("setNotificationsCount", count);
				commit("setFetching", false);

			}
		}).catch(function (error) {

			console.log('ERROR: ', error);
			commit("setFetching", false);

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
	setNotifications(state, notifications) {
		state.notifications = notifications;
	},
	setNotificationsCount(state, newCount) {
		state.newNotificationsCount = newCount;
	}
};
