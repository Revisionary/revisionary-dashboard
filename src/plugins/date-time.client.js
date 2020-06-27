export default (context, inject) => {
	const timeSince = (date) => {

		date = new Date(date);

		// UTC
		var now = new Date();
		var seconds = Math.floor(
			(new Date(now.getTime() + now.getTimezoneOffset() * 60000) -
				date) /
			1000
		);

		var interval = Math.floor(seconds / 31536000);
		if (interval > 1) return interval + " years";
		if (interval == 1) return interval + " year";

		interval = Math.floor(seconds / 2592000);
		if (interval > 1) return interval + " months";
		if (interval == 1) return interval + " month";

		interval = Math.floor(seconds / 86400);
		if (interval > 1) return interval + " days";
		if (interval == 1) return interval + " day";

		interval = Math.floor(seconds / 3600);
		if (interval > 1) return interval + " hours";
		if (interval == 1) return interval + " hour";

		interval = Math.floor(seconds / 60);
		if (interval > 1) return interval + " minutes";
		if (interval == 1) return interval + " minute";

		//return Math.floor(seconds) + " seconds";
		return "in a minute";


	};
	// Inject $hello(msg) in Vue, context and store.
	inject('timeSince', timeSince)
}
