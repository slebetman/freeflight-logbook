// Viewmodel for log_formats page
var $ = require('jquery');

module.exports = {
	setTitle: function (title) {
		$('.title').text(title);
	},
	drawList: function (options) {
		var list = options.map(opt => {
			return `	
			<li class="table-view-cell media">
				<a class="selection" data-setting="${opt}">
					<span class="media-object icon"></span>
					${opt}
				</a>
			</li>`
		}).join('');
		
		$('#option-list').html(list);
	}
}
