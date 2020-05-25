export const state = () => ({
	token: null,
	authenticated: false,
	authUser: null,
	isSideBarOpen: true,
	fetching: false
});

export const getters = {
	getToken(state) {

		if (state.token === null && localStorage.getItem('revisionaryToken'))
			return state.token;

		else if (localStorage.getItem('revisionaryToken'))
			return localStorage.getItem('revisionaryToken');

		return false;

	}
};

export const actions = {

	// Check Authentication with existing token
	authenticate({ commit, state }) {

		commit("setFetching", true);


		// await this.$axios
		// 	.post("https://dapi.revisionary.co/v1/projects")
		// 	.then(res => {
		// 		if (res.status === 200) {
		// 			//console.log(res.data);
		// 			commit("set", res.data.splice(0, 6));
		// 			commit("setFetching", true);
		// 		}
		// 	});


		// Authenticate with the existing token !!!
		if (state.token)
			commit("setAuthenticated", true); console.log('ALREADY AUTHENTICATED.');


		const user = {
			ID: 5,
			email: "bilaltas@me.com",
			first_name: "Bilal",
			last_name: "TAS",
			job_title: "Project Manager",
			department: "Web Development",
			company: "Twelve12",
			picture: null,
			email_notifications: false,
			trial_started_for: null,
			trial_expire_date: null,
			trial_expire_notified: 0,
			user_level_ID: 2
		};
		commit("setUser", user);


		commit("setFetching", false);

	},

	// Create token with login info
	generateToken({ commit }, payload) {

		commit("setFetching", true);


		// await this.$axios
		// 	.post("https://dapi.revisionary.co/v1/projects")
		// 	.then(res => {
		// 		if (res.status === 200) {
		// 			//console.log(res.data);
		// 			commit("set", res.data.splice(0, 6));
		// 			commit("setFetching", true);
		// 		}
		// 	});


		const token = "abcd123";
		const user = {
			ID: 5,
			email: "bilaltas@me.com",
			first_name: "Bilal",
			last_name: "TAS",
			job_title: "Project Manager",
			department: "Web Development",
			company: "Twelve12",
			picture: null,
			email_notifications: false,
			trial_started_for: null,
			trial_expire_date: null,
			trial_expire_notified: 0,
			user_level_ID: 2
		};
		localStorage.setItem("revisionaryToken", token);
		commit("setToken", token);
		commit("setAuthenticated", true); console.log('NEW LOGIN: AUTHENTICATED.');
		commit("setUser", user);


		commit("setFetching", false);

	},

	// Invalidate token to logout
	invalidateToken({ commit }) {

		commit("setFetching", true);
		// await this.$axios
		// 	.post("https://dapi.revisionary.co/v1/projects")
		// 	.then(res => {
		// 		if (res.status === 200) {
		// 			//console.log(res.data);
		// 			commit("set", res.data.splice(0, 6));
		// 			commit("setFetching", true);
		// 		}
		// 	});
		localStorage.removeItem("revisionaryToken");
		commit("setToken", null);
		commit("setAuthenticated", false);
		commit("setFetching", false);

	}

}

export const mutations = {
	setAuthenticated(state, status) {
		state.authenticated = status;
	},
	setToken(state, token) {
		state.token = token;
	},
	setUser(state, user) {
		state.authUser = user;
	},
	setFetching(state, status) {
		state.fetching = status;
	},
	toggleSideBar(state, forceState = null) {
		state.isSideBarOpen = !state.isSideBarOpen;
		if (forceState !== null) state.isSideBarOpen = forceState;
	}
};
