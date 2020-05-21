export default function ({ store, redirect }) {

	return redirect('/projects/');

	// If the user is not authenticated
	if (!store.state.authenticated) {
		//return redirect('/login');
	}

}
