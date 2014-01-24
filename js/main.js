/**
 * Created by fritz on 1/23/14.
 */

if (typeof markdown !== 'undefined') {
	// replace tabs to spaces
	var p = markdown.toHTML;
	markdown.toHTML = function () {
		var html = p.apply(markdown, arguments);
		html = html.replace(/\t/g, '    ');
		return html;
	}
}

function getPostTags(post, allTags) {
	var tags = _.map(post.tags || [], function (sTag) {
		return findTag(allTags, sTag);
	});
	// add default tag
	if (tags.length < 1 && allTags[0]) {
		tags.push(allTags[0]);
	}
	return tags;
}

function findTag(allTags, sTag) {
	return _.find(allTags, match);
	function match(tag) {
		return toSnakeCase(tag.title) === sTag;
	}
}

function getContentFile(target, pFile, callback) {
	$.ajax({
		url: '/content/' + target + '/' + pFile,
		success: function (data) {
			callback(null, data);
		}
	});
}

function getContentMeta(target, callback) {
	$.ajax({
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
