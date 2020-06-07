export const state = () => ({
	users: {
		3: {
			ID: 3,
			email: "bill@twelve12.com",
			first_name: "Bill",
			last_name: "Stone",
			job_title: "Project Manager",
			department: "Web Development",
			company: "Twelve12",
			picture: null,
			email_notifications: false,
			trial_started_for: null,
			trial_expire_date: null,
			trial_expire_notified: 0,
			user_level_ID: 2
		}
	},
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
	async fetch({ commit }, IDs) {

		console.log('FETCHING USERS: ', IDs);

		commit("setFetching", true);

		await this.$axios.post('users', {
			IDs: IDs
		}).then(res => {
			console.log('RESPONSE: ', res);
			if (res.status === 200) {
				console.log('DATA: ', res.data);
				commit('addMultiple', res.data.users);
				commit("setFetching", false);
			}
		}).catch(function (error) {

			console.log('ERROR: ', error);
			commit("setFetching", false);

		});


	}

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
		state.users = users;
	},
	remove(state, ID) {
		if (typeof state.users[ID] !== "undefined")
			delete state.users[ID];
	},
	setFetching(state, status) {
		state.fetching = status;
	}
};
