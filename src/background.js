//Open the extension in a new tab.
chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({ url: "index.html" });
});