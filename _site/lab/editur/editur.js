;(function () {

	editur = window.editur || {};

	var updateTimer,
		updateDelay = 500,
		frame = document.querySelector('#demo-frame');

	editur.demoFrameDocument = frame.contentDocument || frame.contentWindow.document;

	window.onunload = function () {
		editur.saveContent(editur.cm.getValue());
	};

	editur.saveContent = function (content) {
		window.localStorage.editur = content;
	};

	editur.getLastSavedContent = function () {
		return window.localStorage.editur || "";
	};

	editur.setPreviewContent = function (content) {
		var self = this;
		self.demoFrameDocument.open(content);
		self.demoFrameDocument.write(content);
		self.demoFrameDocument.close();
	};

	editur.cm = CodeMirror(document.body, {
		lineNumbers: true,
		mode:  "htmlmixed",
		lineWrapping: true,
		autofocus: true,
		tabMode: "indent",
		autoCloseTags: true
	});

	editur.cm.on("change", function (instance, change) {
		clearTimeout(updateTimer);
		updateTimer = setTimeout(function () {
			editur.setPreviewContent(instance.getValue());
		}, updateDelay);
	});

	function init () {
		var content = editur.getLastSavedContent();

		// load demo content for new user
		if (!content) {
			var reqListener = function () {
				content = this.responseText;
				editur.cm.setValue(content);
				editur.cm.refresh();
				editur.setPreviewContent(content);
			};

			var oReq = new XMLHttpRequest();
			oReq.onload = reqListener;
			oReq.open("get", "demo.html", true);
			oReq.send();
		}
		// load saved content for returning user
		else {
			editur.setPreviewContent(content);
			editur.cm.setValue(content);
			editur.cm.refresh();
		}
	}

	init();

})();