(function (window) {

	var notice;
	var timer;

	function notification(message) {
		if (notice) {
			notice.remove();
			clearTimeout(timer);
		}

		notice = document.createElement('div');
		notice.className = 'notification';
		notice.id = 'notification';
		notice.innerHTML = message;

		document.body.appendChild(notice);

		setTimeout( function () {
			notice.classList.add('show');
		}, 0)

		timer = setTimeout(function () {
			notice.classList.remove('show');

			notice.addEventListener('transitionend', function handler (event) {
				notice.remove();
				notice.removeEventListener(event.type, handler);
				notice = null;
			})
		}, 3000);
	}
	window.notification = notification;

})(this);