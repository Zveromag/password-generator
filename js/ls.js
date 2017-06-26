var ls = window.localStorage;
var defaultOpt = {
	specKey : false,
	upperKey: false,
	numberKey: false,
	len: 8,
	dark: false,
	sync: false
};

Object.keys(defaultOpt).forEach(function (name) {
	if(ls.getItem(name) === null) {
		ls.setItem(name, defaultOpt[name])
	}
});

if (ls.getItem('sync') === 'true') {
	getSync();
}

function getSync(test) {
	chrome.storage.sync.get(function (syncData) {
		Object.keys(syncData).forEach(function (name) {
			ls.setItem(name, syncData[name]);
		});
	});
}

function saveSync(fn) {
	var data = {};

	Object.keys(defaultOpt).forEach(function (name) {
		if (ls[name]) {
			data[name] = ls[name];
		}
	});

	chrome.storage.sync.set(data, function(){
		fn();
	});
}