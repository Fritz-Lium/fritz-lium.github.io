/**
 * Created by fritz on 1/22/14.
 */

$(document).ready(function () {
	// load posts
	var target = 'posts';
	getContentMeta(target, function (data) {
		var extension = data['extension'];
		var allTags = data['tags'];
		var posts = listPosts(data['files']);
		async.map(posts, function (post, next) {
			var pFile = post.path + extension;
			getContentFile(target, pFile, function (err, data) {
				post.content = data;
				next(null, post);
			});
		}, function (err, posts) {
			posts.allTags = allTags;
			renderPosts(posts);
		});
	});
});

function renderPosts(posts) {
	// order by date desc
	posts = posts.reverse();
	var postsHTML = _.map(posts, toPostHTML);
	$('.posts').append(postsHTML);
}

function toPostHTML(post, i, posts) {
	var html = markdown.toHTML(post.content);
	var $tmp = $('<div>').html(html);
	// title
	$tmp.children('h1:first').addClass('post-title')
		.wrapInner('<a href="/post/?path=' + post.path + '">')
		.wrap('<header class="post-header">');
	// tags
	var tags = getPostTags(post, posts.allTags);
	var $meta = $('<p class="post-meta">');
	_.each(tags, function (tag) {
		$('<a class="post-category" href="/?tag=' + toSnakeCase(tag.title) + '">')
			.text(tag.title).css('background-color', tag.color).appendTo($meta);
	});
	$tmp.children('.post-header').append($meta);
	// description
	var $cut = $tmp.children('p').eq(1).nextAll();
	$cut.remove();
	if ($cut.length > 0) {
		$('<p class="cutline">').text('> ... ...').appendTo($tmp);
	}
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
