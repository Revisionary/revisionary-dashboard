export default function ({ redirect, $auth }) {

	if ($auth.loggedIn) redirect('/projects/');
	else redirect('/login/');

}
