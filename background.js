/* BBBro - shows and hides the backbone view borders */

(function(){

	chrome.browserAction.setBadgeBackgroundColor({color: '#5c8bee'});
	chrome.browserAction.setBadgeText({text: 'bro'});

	var on = false;
	chrome.browserAction.onClicked.addListener(toggleExtension);

	function toggleExtension() {
		on = !on;
		chrome.tabs.executeScript({
			code: on ?
				'document.body.className += "bbbro-on"' :
				'document.body.className =document.body.className.replace("bbbro-on", "")'
		});
	}

})();