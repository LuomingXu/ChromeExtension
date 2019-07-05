chrome.contextMenus.create({
    title: 'Search "%s" by Baidu',
    contexts: ['selection'],
    onclick: baidu
});
// chrome.contextMenus.create({
//     title: 'YouDao "%s"',
//     contexts: ['selection'],
//     onclick: youdao
// });
function baidu(info, tab)
{
    var url = "https://www.baidu.com/s?wd="+info['selectionText']+"";
    chrome.tabs.create({
        url: url
    });
}
function youdao(info, tab)
{
    var url = "http://dict.youdao.com/w/"+info['selectionText']+"";
    chrome.tabs.create({
        url: url
    });
}