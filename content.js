/* BBBro - injects a main bbbro.js into the page
because the content script has no access to window property of a document */

var s = document.createElement('script');
s.src = chrome.extension.getURL('bbbro.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);