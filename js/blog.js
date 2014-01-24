/**
 * Created by fritz on 1/22/14.
 */

$(document).ready(function () {
	// load posts
	var target = 'posts';
	getContentMeta(target, function (data) {
		var extension = data['extension'];
		var posts = listPosts(data['files']);
		async.map(posts, function (post, next) {
			var pFile = post.path + extension;
			getContentFile(target, pFile, function (err, data) {
				post.content = data;
				next(null, post);
			});
		}, function (err, posts) {
			renderPosts(posts);
		});
	});
});

function renderPosts(posts) {
	// order by date desc
	posts = posts.reverse();
	var postsHTML = _.map(posts, toPostHTML);
	$('.posts').append(postsHTML);

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
}

function toPostHTML(post) {
	var html = markdown.toHTML(post.content);
	var $tmp = $('<div>').html(html);
	// title
	$tmp.children('h1:first').addClass('post-title')
		.wrapInner('<a>').wrap('<header class="post-header">');
	// description
	$tmp.children().slice(1).wrapAll('<div class="post-description">');
	// section
	$tmp.wrapInner('<section class="post">');
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
