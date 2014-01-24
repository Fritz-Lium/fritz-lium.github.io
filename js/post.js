/**
 * Created by fritz on 1/23/14.
 */
$(document).ready(function () {
	// load post
	var sTitle = getURLParams()['title'];
	var target = 'posts';
	getContentMeta(target, function (data) {
		var extension = data['extension'];
		var post = findPost(data['files'], sTitle);
		var pFile = post['path'] + extension;
		getContentFile(target, pFile, function (err, data) {
			post.content = data;
			renderPost(post);
		});
	});
});

function renderPost(post) {
	$('title').text(post.title);
	$('#main').html(toPostHTML(post));
}

function toPostHTML(post) {
	var html = markdown.toHTML(post.content);
	var $tmp = $('<div>').html(html);
	// header h1
	$tmp.children('h1:first').wrap('<div class="header">');
	// content
	$tmp.children().slice(1).wrapAll('<div class="content">');
	return $tmp.html();
}

function findPost(files, sTitle, pFile) {
	pFile = pFile || '';
	var post;
	for (var key in files) {
		if (key === '.') {
			post = _.find(files[key], match);
			if (post) post.path = pFile + sTitle;
		} else {
			post = findPost(files[key], sTitle, pFile + key + '/');
		}
		if (post) break;
	}
	return post || null;
	function match(post) {
		return toSnakeCase(post.title) === sTitle;
	}
}
