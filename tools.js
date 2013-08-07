/* BBBro - inspects the full object of a selected view in a sidebar pane */

(function(){

	var chromeApi = chrome.devtools.panels.elements;

	chromeApi.createSidebarPane("BBBro - Backbone View", function(broPane) {
		chromeApi.onSelectionChanged.addListener(onSelectionChanged);

		function onSelectionChanged() {
			broPane.setExpression("(" + getBackboneView.toString() + ")()");
		}

		function getBackboneView() {
			function nearestView(elm) {
				return !elm || elm['bbbro-view'] || nearestView(elm.parentElement);
			}
			var view = window._bbbro_view = nearestView($0);
			return view;
		};
	});

})();