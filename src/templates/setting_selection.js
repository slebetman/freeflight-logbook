// Viewmodel for log_formats page
var $ = require('jquery');

module.exports = {
	setTitle: function (title) {
		$('.title').html(title);
	},
	drawList: function (options) {
		var list = options.map(opt => {
			return `	
			<li class="table-view-cell media">
				<a class="selection" data-format="${opt}">
					<span class="media-object icon"></span>
					${opt}
				</a>
			</li>`
		}).join('');
		
		$('#option-list').html(list);
	}
}
