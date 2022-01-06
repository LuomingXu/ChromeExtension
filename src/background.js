var count = 0;

chrome.contextMenus.create({
    id: "Search By Baidu",
    title: 'Search "%s" by Baidu',
    contexts: ['selection'],
});

chrome.contextMenus.onClicked.addListener(
    function baidu(info, tab) {
        var url = "https://www.baidu.com/s?wd=" + info['selectionText'] + "";
        chrome.tabs.create({
            url: url
        });
    }
)

chrome.webNavigation.onHistoryStateUpdated.addListener(
    function (details) {
        chrome.tabs.sendMessage(details.tabId, {
            code: 'github',
            tabId: details.tabId,
            url: details.url,
            event: 'onHistoryStateUpdated',
            count: ++count
        })
    }, { url: [{ hostSuffix: 'github.com' }] }
);
