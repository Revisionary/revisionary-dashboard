export const state = () => ({
	users: {},
	fetching: false
});

export const getters = {
	get(state) {
		return state.users;
	},
	getUser(state) {

		return function (ID) {

			if (typeof state.users[ID] !== "undefined")
				return state.users[ID];

			return false;

		}

	},
	status(state) {
		return state.fetching;
	}
};

export const actions = {

	// Fetch Multiple Users
	async fetch({ commit, state }, IDs) {

		// Find the users from store
		//console.log('UNFILTERED USERS: ', IDs);
		IDs = IDs.filter(ID => typeof state.users[ID] == "undefined");
		//console.log('FILTERED USERS: ', IDs);


		if (!IDs.length) {
			//console.log('No new users to fetch.');
			return;
		}

		//console.log('FETCHING USERS: ', IDs);

		commit("setFetching", true);

		await this.$axios.post('users', {
			IDs: IDs
		}).then(({ status, data }) => {
			if (status === 200) {
				console.log('USERS: ', data.users);
				commit('addMultiple', data.users);
				commit("setFetching", false);
			}
		}).catch(function (error) {

			console.log('ERROR: ', error);
			commit("setFetching", false);

		});


	},

	// Reset Users Pool
	resetUsers({ commit }) {
		commit("set", {});
	},

};

export const mutations = {
	set(state, users) {
		state.users = users;
	},
	update(state, { ID, name, value }) {
		if (typeof state.users[ID] === "undefined")
			return false;

		state.users[ID][name] = value;
	},
	add(state, user) {
		state.users[user.ID] = user;
	},
	addMultiple(state, users) {
		state.users = {
			...state.users,
			...users
		};
	},
	remove(state, ID) {
		if (typeof state.users[ID] !== "undefined")
			delete state.users[ID];
	},
	setFetching(state, status) {
		state.fetching = status;
	}
};
