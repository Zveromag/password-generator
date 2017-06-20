var ls = window.localStorage;
var defaultOpt = {
	specKey : false,
	upperKey: false,
	numberKey: false,
	len: 8,
	dark: false
};

Object.keys(defaultOpt).forEach(function(name){
	if(ls.getItem(name) === null) {
		ls.setItem(name, defaultOpt[name])
	}
});