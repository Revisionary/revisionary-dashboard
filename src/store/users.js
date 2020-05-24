export const state = () => ({
	currentUser: {},
	user: {},
	users: [],
	fetching: false
});

export const getters = {
	get(state) {
		return state.users;
	},
	getUser(state) {
		return state.user;
	},
	getCurrentUser(state) {
		return state.currentUser;
	},
	status(state) {
		return state.fetching;
	}
};

export const actions = {

	// Fetch Users
	async fetch({ commit }, user_IDs) {
		await commit("setFetching", true);
		await commit("set", [
			{
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
			}
		]);
		await commit("setFetching", false);

		// await this.$axios
		// 	.get("https://dapi.revisionary.co/v1/projects")
		// 	.then(res => {
		// 		if (res.status === 200) {
		// 			//console.log(res.data);
		// 			commit("set", res.data.splice(0, 6));
		// 			commit("setFetching", true);
		// 		}
		// 	});
	},

	// Fetch Project Categories
	async fetchCategories({ commit }) {
		await commit("setFetching", false);
		await commit("setCategories", [
			{
				ID: 0,
				title: "Uncategorized"
			},
			{
				ID: 1,
				title: "Personal Projects"
			},
			{
				ID: 2,
				title: "Cat 1"
			},
			{
				ID: 3,
				title: "Cat 2"
			},
			{
				ID: 4,
				title: "Cat 33"
			}
		]);
		await commit("setFetching", true);
	},

	// Get singular project
	async fetchProject({ commit, state }, projectID) {

		// Find the project
		const projectFound = state.projects.find(function (project) {
			return project.ID == projectID;
		});

		if (projectFound) {
			commit("setProject", projectFound);
			return;
		}


		await commit("setFetching", false);
		await commit("setProject", {
			ID: 3,
			title: "4 Marc Pridmore",
			description: "Lorem ipsum dolor sit amet.",
			image_url: "https://placeimg.com/640/480/any",
			user_ID: 6,
			order: 1,
			cat_ID: 0,
			favorite: true,
			users: [1, 2, 3]
		});
		await commit("setFetching", true);


		// await commit("setFetching", false);
		// await this.$axios
		// 	.get(`https://dapi.revisionary.co/v1/projects/${projectID}`)
		// 	.then(res => {
		// 		if (res.status === 200) {
		// 			commit("setProject", res.data);
		// 			commit("setFetching", true);
		// 		}
		// 	});
	},

	// Reset Selected Project
	resetProject({ commit }) {
		commit("setProject", {});
	},

	// Reset Selected Project
	updateProject({ commit }, payload) {

		// DO IT ON BACKEND !!!

		// If successful
		commit("update", payload);

	}
};

export const mutations = {
	set(state, projects) {
		state.projects = projects;
	},
	update(state, payload) {

		const projectID = payload.ID;
		const name = payload.name;
		const value = payload.value;

		// Get the current state of the projects
		let currentProjects = state.projects;

		// Find the index
		const index = currentProjects.findIndex(project => project.ID === projectID);

		if (index > -1) {

			// Modify the project
			currentProjects[index][name] = value;

			// Commit the change
			state.projects = currentProjects;
			return;
		}

		return false;

	},
	setCategories(state, categories) {
		state.projectCategories = categories;
	},
	add(state, project) {
		merge(state.projects, project);
	},
	remove(state, project) {
		state.projects.splice(state.project.indexOf(project), 1);
	},
	setProject(state, project) {
		state.project = project;
	},
	setFetching(state, status) {
		state.isLoaded = status;
	}
};
