export const state = () => ({
	isSideBarOpen: true,
	fetching: false,
	pageLoading: false
});

export const getters = {

};

export const actions = {

}

export const mutations = {
	setFetching(state, status) {
		state.fetching = status;
	},
	toggleSideBar(state, forceState = null) {
		state.isSideBarOpen = !state.isSideBarOpen;
		if (forceState !== null) state.isSideBarOpen = forceState;
		localStorage.setItem('revisionarySidebar', state.isSideBarOpen);
	}
};
