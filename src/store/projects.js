export const state = () => ({
	projectCategories: [
		{
			ID: 0,
			title: "Uncategorized"
		}
	],
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
	fetchCategories({ commit }) {

		commit("setFetching", true);
		commit("setCategories", [
			{
				ID: 0,
				title: "Uncategorized",
				slug: "uncategorized"
			},
			{
				ID: 1,
				title: "Personal Projects",
				slug: "personal-projects"
			},
			{
				ID: 2,
				title: "Cat 1",
				slug: "cat-1"
			},
			{
				ID: 3,
				title: "Cat 2",
				slug: "cat-2"
			},
			{
				ID: 4,
				title: "Cat 33",
				slug: "cat-33"
			}
		]);
		commit("setFetching", false);

	},

	// Fetch Projects
	async fetch({ commit, dispatch }) {

		commit("setFetching", true);
		// await this.$axios
		// 	.get(`https://jsonplaceholder.typicode.com/posts`)
		// 	.then(res => {
		// 		if (res.status === 200) {

		const projects = [
			{
				ID: 21,
				title: "Marc Pridmorasdsad asd easd",
				description: "Lorem ipsum dolor ssit amet. ASD asDsad asd asd as das das d.",
				image_url: "https://placeimg.com/640/480/any",
				user_ID: 6,
				order: 1,
				cat_ID: 0,
				favorite: false,
				archived: true,
				deleted: false,
				date_created: "2019-09-23 10:38:13",
				date_modified: "2019-09-23 10:38:13",
				sub_count: 5,
				users: [1, 2, 3]
			},
			{
				ID: 32,
				title: "Arc Marc Pridmore",
				description: "Lorem ipsum dolor sit amet.",
				image_url: "https://placeimg.com/640/480/any",
				user_ID: 6,
				order: 1,
				cat_ID: 4,
				favorite: false,
				archived: true,
				deleted: false,
				date_created: "2019-09-23 10:38:13",
				date_modified: "2019-09-23 10:38:13",
				sub_count: 14,
				users: [1, 2, 3]
			},
			{
				ID: 43,
				title: "3 Marc Pridmore",
				description: "Lorem ipsum dolor sit amet.",
				image_url: "https://placeimg.com/640/480/any",
				user_ID: 6,
				order: 1,
				cat_ID: 1,
				favorite: false,
				archived: false,
				deleted: false,
				date_created: "2019-09-23 10:38:13",
				date_modified: "2019-09-23 10:38:13",
				sub_count: 8,
				users: [1, 2, 3]
			},
			{
				ID: 54,
				title: "4 Marc Pridmore",
				description: "Lorem ipsum dolor sit amet.",
				image_url: "https://placeimg.com/640/480/any",
				user_ID: 1,
				order: 1,
				cat_ID: 0,
				favorite: true,
				archived: false,
				deleted: false,
				date_created: "2020-03-23 10:38:13",
				date_modified: "2020-03-23 10:38:13",
				sub_count: 4,
				users: [2, 3]
			},
			{
				ID: 65,
				title: "5 Marc Pridmore",
				description: "Lorem ipsum dolor sit amet.",
				image_url: "https://placeimg.com/640/480/any",
				user_ID: 2,
				order: 1,
				cat_ID: 1,
				favorite: true,
				archived: false,
				deleted: false,
				date_created: "2020-05-23 10:38:13",
				date_modified: "2020-05-23 10:38:13",
				sub_count: 7,
				users: [1, 3]
			},
			{
				ID: 76,
				title: "6 Marc Pridmore",
				description: "Lorem ipsum dolor sit amet.",
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
				users: [1, 2, 4]
			},
			{
				ID: 78,
				title: "7 Marc Pridmore",
				description: "Lorem ipsum dolor sit amet.",
				image_url: "https://placeimg.com/640/480/any",
				user_ID: 4,
				order: 1,
				cat_ID: 0,
				favorite: false,
				archived: false,
				deleted: true,
				date_created: "2019-09-23 10:38:13",
				date_modified: "2019-09-23 10:38:13",
				sub_count: 0,
				users: [1, 2, 3]
			}
		];
		commit("set", projects);


		// Take users to batch fetch
		let usersToFetch = [];
		projects.forEach(function (project) {
			usersToFetch.push(project.user_ID);

			project.users.forEach(function (user) {
				usersToFetch.push(user);
			});

		});
		usersToFetch = usersToFetch.filter((v, i, a) => a.indexOf(v) === i); // Make it unique


		// Get the users info
		dispatch("users/fetch", usersToFetch, { root: true });

		// 	}
		// });


		setTimeout(function () {
			commit("setFetching", false);
		}, 1000);


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
