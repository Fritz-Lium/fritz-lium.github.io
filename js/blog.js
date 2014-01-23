/**
 * Created by fritz on 1/22/14.
 */

$(document).ready(function () {
	// redirect to single post page
	$('.posts').delegate('.post .post-title a', 'click', function (event) {
		event.preventDefault();
		var title = $(this).text();
		var sTitle = toSnakeCase(title);
		location.href = '/post/?title=' + sTitle;
	});

	// redirect to tagged posts list
	$('.posts').delegate('.post a.post-category', 'click', function (event) {
		event.preventDefault();
		var tag = $(this).text();
		var sTag = toSnakeCase(tag);
		location.href = '/?tag=' + sTag;
	});
});
