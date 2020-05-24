export const state = () => ({
	token: null,
	authenticated: false,
	initialAuthCheck: false,
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

		// Fetching started
		commit("setFetching", true);


		// Authenticate with the existing token !!!
		if (state.token)
			commit("setAuthenticated", true); console.log('ALREADY AUTHENTICATED.');


		// await this.$axios
		// 	.post("https://dapi.revisionary.co/v1/projects")
		// 	.then(res => {
		// 		if (res.status === 200) {
		// 			//console.log(res.data);
		// 			commit("set", res.data.splice(0, 6));
		// 			commit("setFetching", true);
		// 		}
		// 	});


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
		localStorage.setItem("revisionaryToken", token);
		commit("setToken", token);
		commit("setAuthenticated", true); console.log('NEW LOGIN: AUTHENTICATED.');
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
	setFetching(state, status) {
		state.fetching = status;
	},
	toggleSideBar(state) {
		state.isSideBarOpen = !state.isSideBarOpen;
	}
};
