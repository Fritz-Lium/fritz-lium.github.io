/**
 * Created by fritz on 1/23/14.
 */

(function () {
	// with jquery loaded
	// load scripts
	var globalScripts = ['underscore-min', 'markdown.min'];
	var localScripts = window['localScripts'] || [];
	var scripts = globalScripts.concat(localScripts);
	for (var i = 0; i < scripts.length; i++) {
		$.ajax({
			async: false,
			url: '/js/' + scripts[i] + '.js'
		});
	}
})();

function getContentFile(target, pFile, callback) {
	$.ajax({
		cache: false,
		url: '/content/' + target + '/' + pFile,
		success: callback
	});
}

function getContentMeta(target, callback) {
	$.ajax({
		cache: false,
		url: '/content/' + target + '.json',
		success: callback
	});
}

function toSnakeCase(str) {
	return str.toLowerCase().replace(/ /g, '-');
}

function getURLParams(search) {
	var pat = /([^?=&#]*)=([^?=&#]+)/g, params = {};
	decodeURIComponent(search || location.search)
		.replace(pat, function (a, b, c) {
			if (b in params) {  // 已有该键
				if (!_.isArray(params[b])) params[b] = [params[b]];        // 数组化
				params[b].push(c);
			} else {
				params[b] = c;
			}
		});
	return params;
}
