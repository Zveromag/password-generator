(function(window){

	document.addEventListener('DOMContentLoaded', function () {

		var body = document.body;
		var timer;
		var ls = window.localStorage;
		var switchCheck = document.getElementById('optSwitch');
		var switchBtn = document.querySelector('.option__switch-item');
		var keySpec = document.getElementById('option-spec');
		var keyUpper = document.getElementById('option-upper');
		var keyNumber = document.getElementById('option-number');
		var len = document.getElementById('option-len');
		var sync = document.getElementById('option-sync');
		var history = document.getElementById('option-history');

		keySpec.checked = ls.getItem('specKey') === 'true';
		keyUpper.checked = ls.getItem('upperKey') === 'true';
		keyNumber.checked = ls.getItem('numberKey') === 'true';
		history.checked = ls.getItem('history') === 'true';
		sync.checked = ls.getItem('sync') === 'true';
		switchCheck.checked = ls.getItem('dark') === 'true';
		body.setAttribute('data-dark', ls.getItem('dark'));
		len.value = ls.getItem('len');

		switchCheck.addEventListener('change', function() {
			if (switchCheck.checked) {
				body.setAttribute('data-dark', 'true');
			}
			else {
				body.setAttribute('data-dark', 'false');
			}
		});

		function setOptions(e) {

			e.preventDefault();

			var optionSave = document.getElementById('optionSave');

			ls.setItem('specKey', keySpec.checked);
			ls.setItem('upperKey', keyUpper.checked);
			ls.setItem('numberKey', keyNumber.checked);
			ls.setItem('dark', switchCheck.checked);
			ls.setItem('len', len.value);
			ls.setItem('sync', sync.checked);
			ls.setItem('history', history.checked);

			if (sync.checked) {
				saveSync();
			}

			optionSave.classList.add('show');

			timer && clearTimeout(timer);
			timer = setTimeout(function () {
				optionSave.classList.remove('show');
			}.bind(this), 2000);

		}

		document.forms[0].addEventListener('submit', setOptions);

	})

})(this);