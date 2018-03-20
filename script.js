chrome.contextMenus.create({
    title: 'Search "%s" by Baidu',
    contexts: ['selection'],
    onclick: baidu
});
function baidu(info, tab)
{
    var url = "https://www.baidu.com/s?wd="+info['selectionText']+"";
    chrome.tabs.create({
        url: url
    });
}