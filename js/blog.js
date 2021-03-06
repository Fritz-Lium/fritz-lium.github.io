/**
 * Created by fritz on 1/22/14.
 */
var params = getURLParams();
var pageSize = 3;
var allTags;

$(document).ready(function () {
	// load posts
	var target = 'posts';
	getContentIndex(target, function (data) {
		allTags = data['meta']['tags'];
		// order by date desc
		var posts = data['list'].reverse();
		var sTag = params['tag'];
		if (sTag) {
			var defaultTag = allTags[0].title;
			var tag = _.find(allTags, function (oTag) {
				return toSnakeCase(oTag.title) === sTag;
			});
			posts = _.filter(posts, function (post) {
				if (sTag === toSnakeCase(defaultTag)) {
					return !post.tags || post.tags.length < 1;
				}
				return _.contains(post.tags, sTag);
			});
			$('.content-subhead').text('Posts on Tag \'' + tag.title + '\'');
		} else {
			$('.content-subhead').text('All Posts');
		}

		var pageCount = Math.ceil(posts.length / pageSize) || 1;
		var page = ~~params['page'] || 1;
		// page bound
		if (page < 1) {
			location.href = toURI({ tag: tag });
		} else if (page > pageCount) {
			location.href = toURI({ tag: tag, page: pageCount });
		}
		var start = pageSize * (page - 1);
		posts = posts.slice(start, start + pageSize);

		var $paginator = $('#paginator');
		$paginator.find('.current').text(page);
		if (page > 1) {
			$paginator.find('.prev').attr('href', toURI({ tag: tag, page: page - 1 }));
		}
		if (page < pageCount) {
			$paginator.find('.next').attr('href', toURI({ tag: tag, page: page + 1 }));
		}

		async.map(posts, function (post, next) {
			getContentFile(target, post.file, function (err, data) {
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
	var postsHTML = _.map(posts, toPostHTML);
	$('.posts').append(postsHTML);
}

function toPostHTML(post) {
	var html = markdown.toHTML(post.content);
	var $tmp = $('<div>').html(html);
	// title
	$tmp.children('h1:first').addClass('post-title')
		.wrapInner('<a href="/post/?file=' + post.file + '">')
		.wrap('<header class="post-header">');
	// tags
	var tags = getPostTags(post, allTags);
	var $meta = $('<p class="post-meta">');
	_.each(tags, function (tag) {
		$('<a class="post-category" href="' + toURI({
			tag: toSnakeCase(tag.title)
		}) + '">').text(tag.title).css('background-color', tag.color).appendTo($meta);
	});
	$('<span class="post-date">').text(moment(post.date).fromNow()).appendTo($meta);
	$tmp.children('.post-header').append($meta);
	// description
	var $cut = $tmp.children('p, pre').eq(1).nextAll();
	$cut.remove();
	if ($cut.length > 0) {
		$('<p class="cutline">').text('> ... ...').appendTo($tmp);
	}
	$tmp.children().slice(1).wrapAll('<div class="post-description">');
	// section
	$tmp.wrapInner('<section class="post">');
	return $tmp.html();
}
