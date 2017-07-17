(function(window){

	'use strict';

	function PassGen() {

		this.getOptions();

		this.mainContainer = document.querySelector('.pass');
		this.form = this.mainContainer.querySelector('.pass__form');
		this.result = this.mainContainer.querySelector('.pass__result');
		this.mess = this.mainContainer.querySelector('.pass__copy');
		this.timer;
		this.options = {
			keySpec: '!@#$%^&*(){}[]:?~<>',
			keyUpper: 'QWERTYUIOPASDFGHJKLZXCVBNM',
			keyLower: 'qwertyuiopasdfghjklzxcvbnm',
			keyNumber: '1234567890',
		};

		this.handler = this.onSubmit.bind(this);

		this.form.addEventListener('submit', this.handler);
		this.mainContainer.addEventListener('click', this.copy.bind(this));

		if (ls.getItem('history') === 'true') {
			this.history();
		}
	}

	PassGen.prototype.getOptions = function () {
		var ls = window.localStorage;

		document.body.setAttribute('data-dark', ls.getItem('dark'));
		document.getElementById('pass-spec').checked = ls.getItem('specKey') === 'true';
		document.getElementById('pass-upper').checked = ls.getItem('upperKey') === 'true';
		document.getElementById('pass-number').checked = ls.getItem('numberKey') === 'true';
		document.getElementById('pass-len').value = ls.getItem('len');
	}

	PassGen.prototype.onSubmit = function (e) {
		e.preventDefault();

		this.result.innerHTML = '';

		var len = this.form.querySelector('#pass-len').value;
		var checkboxs = Array.prototype.slice.call(this.form.querySelectorAll('[type=checkbox]:checked'));
		var words = this.options.keyLower;
		var passCount = 6;

		checkboxs.forEach(function (checkbox) {
			var name = checkbox.getAttribute("name");
			if (this.options.hasOwnProperty(name)) {
				words += this.options[name];
			}
		}.bind(this));

		for (var i = 0; i < passCount; i++) {
			this.generate(words, len, i);
		}
	}

	PassGen.prototype.generate = function (words, len, delay) {
		var pass = '';

		for (var i = 0; i < len; i++) {
			var pos = Math.floor(Math.random() * (words.length - 1));
			pass += words[pos];
		}

		var container = Object.assign(document.createElement('div'), {
			className: 'pass__item',
			style: 'animation-delay:' + ( delay/4 ) + 's',
			textContent: pass
		});
		this.result.appendChild(container);
	}

	PassGen.prototype.copy = function (e) {

		var target;

		if (e.target.closest('.pass__item') || e.target.closest('.history-drawer__item')) {
			target = e.target;
		}
		else {
			return;
		}

		e.preventDefault();

		if (this.timer) {
			clearTimeout(this.timer);
			this.mess.classList.remove('show');
		}

		var range = document.createRange();
		var select = window.getSelection();

		range.selectNode(target);
		select.removeAllRanges();
		select.addRange(range);
		document.execCommand('copy');
		window.getSelection().removeAllRanges();

		Array.prototype.slice.call(this.mainContainer.querySelectorAll('.iscopy')).forEach(function (item) {
			item.classList.remove('iscopy');
		});
		target.classList.add('iscopy');
		this.mess.classList.add('show');

		this.timer = setTimeout(function () {
			this.mess.classList.remove('show');
		}.bind(this), 1500);

		if (ls.getItem('history') === 'true' && target.classList.contains('pass__item')) {
			var passwords = JSON.parse(ls.getItem('password'));

			var options = {
				year: 'numeric', month: 'numeric', day: 'numeric',
				hour: 'numeric', minute: 'numeric', second: 'numeric',
				hour12: false
			};
			var passwordDate = new Intl.DateTimeFormat(window.navigator.language, options).format(new Date());

			if (passwords.length >= ls.getItem('historyLength')) {
				passwords.shift();
			}

			passwords.push({
				password: target.textContent,
				passwordDate: passwordDate
			});
			ls.setItem('password', JSON.stringify(passwords));

			if (ls.getItem('sync') === 'true') {
				chrome.storage.sync.set({'password': ls.getItem('password')});
			}

			this.renderHistory(passwords, passwordDate);
		}
	}

	PassGen.prototype.history = function () {
		var icon = document.createElement('div');
		icon.className = 'history-icon';
		icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path d="M663.3 309.4c150.1 0 272.2 122.1 272.2 272.2S813.4 853.8 663.3 853.8s-272.2-122-272.2-272.1c0-150.1 122.1-272.3 272.2-272.3m0-54.4c-180.4 0-326.7 146.3-326.7 326.7 0 180.4 146.3 326.7 326.7 326.7S990 762.1 990 581.7C990 401.3 843.7 255 663.3 255zM118.9 146.1h353.9v54.4H118.9v-54.4zM118.9 363.9h217.8v54.4H118.9v-54.4zM118.9 581.7h163.3v54.4H118.9v-54.4zM118.9 799.4h245v54.4h-245v-54.4z"/><path d="M663.3 608.9c-15 0-27.2-12.3-27.2-27.2V391.1c0-15 12.2-27.2 27.2-27.2s27.2 12.2 27.2 27.2v190.6c.1 14.9-12.2 27.2-27.2 27.2z"/><path d="M853.9 581.7c0 15-12.2 27.2-27.2 27.2H663.3c-15 0-27.2-12.2-27.2-27.2s12.2-27.2 27.2-27.2h163.3c15.1-.1 27.3 12.1 27.3 27.2z"/><path d="M826.7 200.6l-.5-.3c-1.3-17.6-10.7-33.6-25.9-42.8L567.4 17.8c-8.5-5.1-18.1-7.8-28-7.8h-475C34.4 10 10 34.4 10 64.4v871.1c0 30.1 24.4 54.4 54.4 54.4h707.8c30.1 0 54.4-24.4 54.4-54.4v-27.2h-27.2v27.2c0 15-12.2 27.2-27.2 27.2H64.4c-15 0-27.2-12.2-27.2-27.2V64.4c0-15 12.2-27.2 27.2-27.2h462.8v108.9c0 30.1 24.4 54.4 54.4 54.4H799c.2 1.2.5 2.4.5 3.6V255h27.2v-50.8c0-1.2-.4-2.4-.5-3.6h.5z"/></svg>';
		var background = document.createElement('div');
		background.className = 'history__bg';

		this.mainContainer.appendChild(background);
		this.mainContainer.appendChild(icon);

		var passwords = JSON.parse(ls.getItem('password'));
		this.renderHistory(passwords);

		icon.addEventListener('click', function () {
			document.body.classList.toggle('active-drawer');
		});
		background.addEventListener('click', function () {
			document.body.classList.toggle('active-drawer');
		})

	}

	PassGen.prototype.renderHistory = function (passwords, passwordDate) {

		var drawer;

		if (drawer = document.getElementById('drawer')) {
			drawer.remove();
		}

		drawer = document.createElement('div');
		drawer.className = 'history-drawer';
		drawer.id = 'drawer';

		var fragment = document.createDocumentFragment();

		passwords.forEach(function (obj) {
			var passwordItem = document.createElement('div');

			passwordItem.className = 'history-drawer__item';
			passwordItem.textContent = obj.password;
			passwordItem.setAttribute('title', obj.passwordDate);
			fragment.appendChild(passwordItem);
		});

		drawer.innerHTML = '';
		drawer.appendChild(fragment);

		this.mainContainer.appendChild(drawer);

	}

	document.addEventListener('DOMContentLoaded', function () {
		new PassGen();
	});

})(this);