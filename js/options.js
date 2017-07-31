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
		var passCount = document.getElementById('option-pass-count');
		var len = document.getElementById('option-len');
		var sync = document.getElementById('option-sync');
		var history = document.getElementById('option-history');
		var historyLen = document.getElementById('history-len');
		var clearHistoryBtn = document.getElementById('clear-history');

		keySpec.checked = ls.getItem('specKey') === 'true';
		keyUpper.checked = ls.getItem('upperKey') === 'true';
		keyNumber.checked = ls.getItem('numberKey') === 'true';
		history.checked = ls.getItem('history') === 'true';
		historyLen.value = ls.getItem('historyLength');
		historyLen.disabled = (ls.getItem('history') === 'true')? false : true;
		clearHistoryBtn.disabled = (ls.getItem('history') === 'true') ? false : true;
		sync.checked = ls.getItem('sync') === 'true';
		switchCheck.checked = ls.getItem('dark') === 'true';
		body.setAttribute('data-dark', ls.getItem('dark'));
		len.value = ls.getItem('len');
		passCount.value = ls.getItem('passCount');

		switchCheck.addEventListener('change', function() {
			if (switchCheck.checked) {
				body.setAttribute('data-dark', 'true');
			}
			else {
				body.setAttribute('data-dark', 'false');
			}
		});

		history.addEventListener('change', function() {
			if (history.checked) {
				historyLen.disabled = false;
				clearHistoryBtn.disabled = false;
			}
			else {
				historyLen.disabled = true;
				clearHistoryBtn.disabled = true;
			}
		})

		if (ls.getItem('history') === 'true') {
			clearHistoryBtn.addEventListener('click', function(e) {
				e.preventDefault();

				ls.setItem('password', '[]');
				chrome.storage.sync.set({ 'password': '[]' });

				notification(chrome.i18n.getMessage('resetHistory'));
			});
		}


		function setOptions(e) {

			e.preventDefault();

			ls.setItem('specKey', keySpec.checked);
			ls.setItem('upperKey', keyUpper.checked);
			ls.setItem('numberKey', keyNumber.checked);
			ls.setItem('passCount', passCount.value);
			ls.setItem('dark', switchCheck.checked);
			ls.setItem('len', len.value);
			ls.setItem('sync', sync.checked);
			ls.setItem('history', history.checked);
			ls.setItem('historyLength', historyLen.value);

			if (sync.checked) {
				saveSync();
			}

			notification(chrome.i18n.getMessage('saveOption'));

		}

		document.forms[0].addEventListener('submit', setOptions);

	})

})(this);