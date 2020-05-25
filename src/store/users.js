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
	fetch({ commit, state }, IDs) {

		console.log('FETCHING USERS: ', IDs);

		commit("setFetching", true);

		// await this.$axios
		// 	.get("https://dapi.revisionary.co/v1/projects")
		// 	.then(res => {
		// 		if (res.status === 200) {
		// 			//console.log(res.data);
		// 			commit("set", res.data.splice(0, 6));
		// 			commit("setFetching", true);
		// 		}
		// 	});



		IDs.forEach(function (ID) {

			if (typeof state.users[ID] !== "undefined") return true;

			commit("add", {
				ID: ID,
				email: "bilaltas@me.com",
				first_name: "Bilal",
				last_name: "TAS" + ID,
				job_title: "Project Manager",
				department: "Web Development",
				company: "Twelve12",
				picture: null,
				email_notifications: false,
				trial_started_for: null,
				trial_expire_date: null,
				trial_expire_notified: 0,
				user_level_ID: 2
			});

		});

		commit("setFetching", false);

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
	remove(state, ID) {
		if (typeof state.users[ID] !== "undefined")
			delete state.users[ID];
	},
	setFetching(state, status) {
		state.fetching = status;
	}
};
