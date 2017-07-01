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
	//this.result.addEventListener('click', this.copy.bind(this));
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
		this.generate(words, len);
	}
}

PassGen.prototype.generate = function (words, len) {
	var pass = '';

	for (var i = 0; i < len; i++) {
		var pos = Math.floor(Math.random() * (words.length - 1));
		pass += words[pos];
	}

	this.type(pass);
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

		if (passwords.length >= 8) {
			passwords.shift();
		}

		passwords.push(target.textContent);
		ls.setItem('password', JSON.stringify(passwords));

		this.renderHistory(passwords);
	}
}

PassGen.prototype.type = function (pass) {
	var container = Object.assign(document.createElement('div'), {className: 'pass__item'});
	var passLen = pass.length - 1;
	var index = 0;

	this.result.appendChild(container);

	var si = setInterval(function(){
		if (index === passLen) {
			clearInterval(si);
		}
		container.textContent += pass[index];
		index++;
	}, 50)
}

PassGen.prototype.history = function () {
	var icon = document.createElement('div');
	icon.className = 'history-icon';
	icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path d="M315.6 954.1c-60.8-24.7-115.3-60.9-162.1-107.6-54.2-54.2-94-118.4-118.2-190.6-23-68.9-30.5-143.5-21.7-215.8l58.7 7.2c-16.3 132.7 28.6 263 123 357.4C276.7 886 384.9 930.8 500 930.8S723.3 886 804.7 804.6c168-168 168-441.3 0-609.3C723.3 114 615.1 69.2 500 69.2S276.7 114 195.3 195.4c-20.6 20.6-39.1 43.2-55 67.2L91 229.9c18.1-27.3 39.1-53.1 62.5-76.4 46.8-46.8 101.3-83 162.1-107.6C374.3 22.1 436.3 10 500 10s125.7 12.1 184.4 35.9c60.8 24.7 115.3 60.9 162.1 107.6 46.8 46.8 83 101.3 107.6 162.1C977.9 374.3 990 436.4 990 500c0 63.6-12.1 125.7-35.9 184.4-24.7 60.8-60.9 115.4-107.6 162.1-46.8 46.8-101.3 83-162.1 107.6C625.6 977.9 563.6 990 500 990c-63.6 0-125.7-12.1-184.4-35.9z"/><path d="M331.3 253.3c0 5.7-4.7 10.4-10.4 10.4H100.7c-5.7 0-10.4-4.7-10.4-10.4V33.2c0-5.7 4.7-10.4 10.4-10.4l230.6 230.5zM562.2 583.1H320.6v-48.5h193.1V253.7h48.5v329.4z"/></svg>';
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

PassGen.prototype.renderHistory = function (passwords) {

	var drawer;

	if (drawer = document.getElementById('drawer')) {
		drawer.remove();
	}

	drawer = document.createElement('div');
	drawer.className = 'history-drawer';
	drawer.id = 'drawer';

	var fragment = document.createDocumentFragment();

	passwords.forEach(function (password) {
		var passwordItem = document.createElement('div');

		passwordItem.className = 'history-drawer__item';
		passwordItem.textContent = password;
		fragment.appendChild(passwordItem);
	});

	drawer.innerHTML = '';
	drawer.appendChild(fragment);

	this.mainContainer.appendChild(drawer);

}

document.addEventListener('DOMContentLoaded', function () {
	new PassGen();
});