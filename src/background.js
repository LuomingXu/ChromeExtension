chrome.contextMenus.create({
    title: 'Search "%s" by Baidu',
    contexts: ['selection'],
    onclick: baidu
});
function baidu(info, tab) {
    console.log("exist")
    var url = "https://www.baidu.com/s?wd=" + info['selectionText'] + "";
    chrome.tabs.create({
        url: url
    });
}


chrome.webNavigation.onHistoryStateUpdated.addListener(
    function () {
        chrome.tabs.executeScript(null, { file: 'src/main.js' });
    },
    {
        url: [{ hostSuffix: 'github.com' }]
    }
);
