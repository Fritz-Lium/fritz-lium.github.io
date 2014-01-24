/**
 * Created by fritz on 1/22/14.
 */

$(document).ready(function () {
	// load posts
	var target = 'posts';
	getContentMeta(target, function (data) {
		var extension = data['extension'];
		var posts = listPosts(data['files']);
		var pFileMap = _.map(posts, function (post) {
			return post['path'] + extension;
		});
		var fileMap = getContentFileMap(target, pFileMap);
		console.log(fileMap)
	});

	// link to single post page
	$('.posts').find('.post .post-title a').each(function (i, el) {
		var title = $(el).text();
		var sTitle = toSnakeCase(title);
		$(el).attr('href', '/post/?title=' + sTitle);
	});

	// link to tagged posts list
	$('.posts').find('.post a.post-category').each(function (i, el) {
		var tag = $(el).text();
		var sTag = toSnakeCase(tag);
		$(el).attr('href', '/?tag=' + sTag);
	});
});

function toPostHTML(post) {
	var html = markdown.toHTML(post.content);
	var $tmp = $('<div>').html(html);
	// header h1
	$tmp.children('h1:first').wrap('<div class="header">');
	// content
	$tmp.children().not('.header').wrapAll('<div class="content">');
	return $tmp.html();
}

function listPosts(files, pFile) {
	pFile = pFile || '';
	var posts = [];
	for (var key in files) {
		if (key === '.') {
			posts = posts.concat(files[key]);
			_.each(posts, function (post) {
				var sTitle = toSnakeCase(post.title);
				post.path = pFile + sTitle;
			});
		} else {
			posts = posts.concat(listPosts(files[key], pFile + key + '/'));
		}
	}
	return posts;
}
