/**
 * Created by fritz on 1/23/14.
 */

function findTag(tags, sTag) {
	return _.find(tags, match);
	function match(tag) {
		return toSnakeCase(tag.title) === sTag;
	}
}

function getContentFile(target, pFile, callback) {
	$.ajax({
		cache: false,
		url: '/content/' + target + '/' + pFile,
		success: function (data) {
			callback(null, data);
		}
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
