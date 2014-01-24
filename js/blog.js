/**
 * Created by fritz on 1/22/14.
 */

$(document).ready(function () {
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
