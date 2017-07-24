var ls = window.localStorage;
var defaultOpt = {
	specKey : false,
	upperKey: false,
	numberKey: false,
	len: 8,
	passCount: 6,
	dark: false,
	sync: false,
	history: false,
	password: '[]',
	historyLength: 50
};

Object.keys(defaultOpt).forEach(function (name) {
	if(ls.getItem(name) === null) {
		ls.setItem(name, defaultOpt[name])
	}
});

if (ls.getItem('sync') === 'true') {
	getSync();
}

function getSync() {
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

	chrome.storage.sync.set(data, function(fn){
		fn && fn();
	});
}