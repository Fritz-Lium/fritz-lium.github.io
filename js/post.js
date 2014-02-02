/**
 * Created by fritz on 1/23/14.
 */
$(document).ready(function () {
	// load post
	var file = getURLParams()['file'];
	var target = 'posts';
	getContentIndex(target, function (data) {
		var allTags = data['meta']['tags'];
		var post = _.find(data['list'], function(post){
			return post.file === file;
		});
		getContentFile(target, file, function (err, data) {
			post.content = data;
			post._tags = getPostTags(post, allTags);
			renderPost(post);
		});
		// order by date desc
		var posts = data['list'].reverse();
		renderMenu(posts, post);
	});
});

function renderMenu(posts, post) {
	var $tmp = _.reduce(posts, function ($memo, _post) {
		var $li = $('<li>');
		var $a = $('<a>').text(_post.title).appendTo($li);
		if (_post === post) {
			$li.addClass('pure-menu-selected');
		} else {
			$a.attr('href', '/post/?file=' + _post.file);
		}
		return $memo.append($li);
	}, $('<div>'));
	$('#menu-list').append($tmp.html());
}

function renderPost(post) {
	$('title').text(post.title);
	$('#main').html(toPostHTML(post));
}

function toPostHTML(post) {
	var html = markdown.toHTML(post.content);
	var $tmp = $('<div>').html(html);
	// header h1
	$tmp.children('h1:first').wrap('<div class="header">');
	// tags
	var $meta = $('<p class="post-meta">');
	$meta.append('<span class="post-date">' + moment(post.date).fromNow() + '</span>');
	_.each(post._tags, function (tag) {
		$('<a class="post-category" href="/?tag=' + toSnakeCase(tag.title) + '">')
			.text(tag.title).css('background-color', tag.color).appendTo($meta);
	});
	$tmp.children('.header').prepend($meta);
	// content
	$tmp.children().slice(1).wrapAll('<div class="content">');
	return $tmp.html();
}
