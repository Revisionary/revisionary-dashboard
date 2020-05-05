export const state = () => ({
	projects: [],
	project: {},
	isLoaded: false,
});

export const getters = {
	get(state) {
		return state.projects;
	},
	getProject(state) {
		return state.project;
	},
	status(state) {
		return state.isLoaded;
	},
};

export const actions = {
	async get({ commit }) {
		await commit("setStatus", false);
		await this.$axios
			.get("https://dapi.revisionary.co/v1/projects")
			.then((res) => {
				if (res.status === 200) {
					console.log(res.data);
					commit("set", res.data);
					commit("setStatus", true);
				}
			});
	},
	async getProject({ commit }, projectID) {
		await commit("setStatus", false);
		await this.$axios
			.get(`https://dapi.revisionary.co/v1/projects/${projectID}`)
			.then((res) => {
				if (res.status === 200) {
					commit("setProject", res.data);
					commit("setStatus", true);
				}
			});
	},
	async set({ commit }, project) {
		await commit("set", project);
	},
};

export const mutations = {
	set(state, projects) {
		state.projects = projects;
	},
	setStatus(state, status) {
		state.isLoaded = status;
	},
	add(state, project) {
		merge(state.projects, project);
	},
	remove(state, { project }) {
		state.projects.splice(state.project.indexOf(project), 1);
	},
	setProject(state, project) {
		state.project = project;
	},
};
