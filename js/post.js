/**
 * Created by fritz on 1/23/14.
 */
$(document).ready(function () {
	// load post
	var sPath = getURLParams()['path'];
	var target = 'posts';
	getContentMeta(target, function (data) {
		var extension = data['extension'];
		var allTags = data['tags'];
		var post = findPost(data['files'], sPath);
		var pFile = sPath + extension;
		getContentFile(target, pFile, function (err, data) {
			post.content = data;
			post._tags = getPostTags(post, allTags);
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
	// tags
	var $meta = $('<p class="post-meta">');
	$('<span class="post-date">').text(moment(post.date).fromNow()).appendTo($meta);
	_.each(post._tags, function (tag) {
		$('<a class="post-category" href="/?tag=' + toSnakeCase(tag.title) + '">')
			.text(tag.title).css('background-color', tag.color).appendTo($meta);
	});
	$tmp.children('.header').prepend($meta);
	// content
	$tmp.children().slice(1).wrapAll('<div class="content">');
	return $tmp.html();
}

function findPost(files, sPath) {
	var segs = sPath.split('/');
	var sTitle = segs.slice(-1)[0];
	try {
		var p = files;
		_.each(segs.slice(0, -1), function (seg) {
			p = p[seg];
		});
		return _.find(p['.'], match) || null;
	} catch (err) {
		return null;
	}
	function match(post) {
		return toSnakeCase(post.title) === sTitle;
	}
}
/*function findPost(files, sTitle, pFile) {
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
 }*/
