function PassGen() {

	this.getOptions();

	this.form = document.querySelector('.pass__form');
	this.result = document.querySelector('.pass__result');
	this.mess = document.querySelector('.pass__copy');
	this.timer;
	this.options = {
		keySpec: '!@#$%^&*(){}[]:?~<>',
		keyUpper: 'QWERTYUIOPASDFGHJKLZXCVBNM',
		keyLower: 'qwertyuiopasdfghjklzxcvbnm',
		keyNumber: '1234567890',
	};

	this.handler = this.onSubmit.bind(this);

	this.form.addEventListener('submit', this.handler);
	this.result.addEventListener('click', this.copy.bind(this));
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
	var target = e.target;
	if (!target.closest('.pass__result')) return;

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

	Array.prototype.slice.call(this.result.querySelectorAll('.iscopy')).forEach(function (item) {
		item.classList.remove('iscopy');
	});
	target.classList.add('iscopy');
	this.mess.classList.add('show');

	this.timer = setTimeout(function () {
		this.mess.classList.remove('show');
	}.bind(this), 1500);
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
	}, 30)
}

document.addEventListener('DOMContentLoaded', function () {
	new PassGen();
});