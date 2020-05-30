export default function (context) {

	var dropdowns = document.getElementsByTagName('details');
	for (var i = 0; i < dropdowns.length; i++) {
		dropdowns[i].removeAttribute('open')
	}

}
