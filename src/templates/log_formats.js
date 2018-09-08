// Viewmodel for log_formats page
var $ = require('jquery');

module.exports = {
	drawList: function (formats) {
		var list = formats.map(f => {
			return `	
			<li class="table-view-cell media">
				<a class="selection" data-format="${f.rowid}">
					<span class="media-object icon"></span>
					${f.name}
				</a>
			</li>`
		}).join('');
		
		$('#format-list').html(list);
	}
}
