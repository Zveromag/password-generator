document.addEventListener('DOMContentLoaded', function () {

	var body = document.body;
	var ls = window.localStorage;
	var switchCheck = document.getElementById('optSwitch');
	var switchBtn = document.querySelector('.option__switch-item');
	var keySpec = document.getElementById('option-spec');
	var keyUpper = document.getElementById('option-upper');
	var keyNumber = document.getElementById('option-number');
	var len = document.getElementById('option-len');
	var sync = document.getElementById('option-sync');

	keySpec.checked = ls.getItem('specKey') === 'true';
	keyUpper.checked = ls.getItem('upperKey') === 'true';
	keyNumber.checked = ls.getItem('numberKey') === 'true';
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

		ls.setItem('specKey', keySpec.checked);
		ls.setItem('upperKey', keyUpper.checked);
		ls.setItem('numberKey', keyNumber.checked);
		ls.setItem('dark', switchCheck.checked);
		ls.setItem('len', len.value);
		ls.setItem('sync', sync.checked);

		if (sync.checked) {
			saveSync();
		}

		chrome.tabs.update({url:'chrome://newtab/'});
	}

	document.forms[0].addEventListener('submit', setOptions);

})