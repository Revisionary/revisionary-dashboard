export const state = () => ({
	projectCategories: [],
	projects: [],
	project: {},
	fetching: false
});

export const getters = {
	get(state) {
		return state.projects;
	},
	getCategories(state) {
		return state.projectCategories;
	},
	getProject(state) {
		return state.project;
	},
	status(state) {
		return state.fetching;
	}
};

export const actions = {

	// Fetch Project Categories
	async fetchCategories({ commit }) {

		commit("setFetching", true);

		await this.$axios.get('projectcategories').then(res => {
			//console.log('RESPONSE: ', res);
			if (res.status === 200) {
				console.log('PROJECT CATS: ', res.data.categories);
				commit('setCategories', res.data.categories);
				commit("setFetching", false);
			}
		}).catch(function (error) {

			console.log('ERROR: ', error);
			commit("setFetching", false);

		});

	},

	// Fetch Projects
	async fetch({ commit, dispatch }) {

		commit("setFetching", true);


		await this.$axios.get('projects').then(res => {
			//console.log('RESPONSE: ', res);
			if (res.status === 200) {
				console.log('PROJECTS: ', res.data.projects);

				const projects = res.data.projects;

				commit('set', projects);
				commit("setFetching", false);


				// Take users to batch fetch
				let usersToFetch = [];
				projects.forEach(function (project) {
					usersToFetch.push(project.user_ID);

					project.users.forEach(user => {
						usersToFetch.push(parseInt(user));
					});

				});
				usersToFetch = usersToFetch.filter((v, i, a) => a.indexOf(v) === i); // Make it unique


				// Get the users info
				dispatch("users/fetch", usersToFetch, { root: true });

			}
		}).catch(function (error) {

			console.log('ERROR: ', error);
			commit("setFetching", false);

		});


	},

	// Get singular project
	async fetchProject({ commit, state }, projectID) {

		console.log('PROJECT FETCHING');

		// Find the project
		const projectFound = state.projects.find(function (project) {
			return project.ID == projectID;
		});

		if (projectFound) {
			commit("setProject", projectFound);
			return;
		}


		commit("setFetching", true);
		// await this.$axios
		// 	.get(`https://jsonplaceholder.typicode.com/posts`)
		// 	.then(res => {
		// 		if (res.status === 200) {

		commit("setProject", {
			ID: 54,
			title: "Marc Pridmore",
			description: "Marc Pridmore’s new website and design overhaul on WordPress.",
			image_url: "https://placeimg.com/640/480/any",
			user_ID: 3,
			order: 1,
			cat_ID: 2,
			favorite: true,
			archived: false,
			deleted: false,
			date_created: "2019-09-23 10:38:13",
			date_modified: "2019-09-23 10:38:13",
			sub_count: 15,
			users: [1, 2, 4, 5]
		});

		setTimeout(function () {
			commit("setFetching", false);
		}, 1000);

		// 	}
		// });

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
	update(state, { ID, name, value }) {

		// Get the current state of the projects
		let currentProjects = state.projects;

		// Find the index
		const index = currentProjects.findIndex(project => project.ID === ID);

		if (index > -1) {

			// Modify the project
			currentProjects[index][name] = value;

			// Commit the change
			state.projects = currentProjects;

			// If current project is this one
			if (state.project.ID == ID)
				state.project = currentProjects[index];

		}

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
		state.fetching = status;
	}
};
