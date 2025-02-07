var current_href = window.location.href;
var new_href = current_href;
var url = new URL(current_href)
var keys = Array.from(url.searchParams.keys())
console.log(url)
function replace_url(current_href, new_href) {
    if (current_href !== new_href)
        window.location.replace(new_href)
}

if (current_href.includes("item.m.jd.com")) {
    // https://item.m.jd.com/product/31815069118.html
    new_href = current_href.replace("m.", "")
    new_href = new_href.replace("/product", "")
    for (var item of keys) {
        url.searchParams.delete(item)
    }
} else if (current_href.includes("item.taobao.com") || current_href.includes("detail.tmall.com")) {
    // remove taobao useless params
    for (var item of keys) {
        if (item !== "id")
            url.searchParams.delete(item)
    }
    url.hash = ""

    new_href = url.toString()
} else if (url.host === "item.jd.com") {
    for (var item of keys) {
        if (item == "t")
            continue
        url.searchParams.delete(item)
    }
    url.hash = ""
    new_href = url.toString()
} else if (url.host.endsWith("bilibili.com")) {
    if (current_href.includes("https://www.bilibili.com/video/BV")
        || current_href.includes("https://www.bilibili.com/video/av")) {
        for (var item of keys) {
            if (item == "p")
                continue
            url.searchParams.delete(item)
        }
    } else if (url.host === "live.bilibili.com") {
        const params = ["session_id", "visit_id", "spm_id_from", "hotRank", "broadcast_type", "is_room_feed"]
        for (var item of keys) {
            if (params.includes(item)) {
                url.searchParams.delete(item)
            }
        }
    } else if (current_href.includes("linkfilter")) {
         // http://game.bilibili.com/linkfilter/?url=https://dspcalculator.github.io/dsp-calc/
        url = new URL(url.searchParams.get("url"))
    }     else {
        url.searchParams.delete("spm_id_from")
    }

    new_href = url.toString()
} else if (url.host === "img30.360buyimg.com") {
    const reg = /\d+x\d+/
    url.pathname = url.pathname.replace(reg, "2000x2000")
    new_href = url.toString()
} else if (url.host.endsWith("wikipedia.org")) {
    if (url.host.endsWith("m.wikipedia.org"))
        url.host = url.host.replace("m.wikipedia.org", "wikipedia.org");
    if (url.pathname.startsWith("/zh-"))
        url.pathname = url.pathname.replace(/zh-.*?\//, "zh-cn/")
    new_href = url.toString();
} else if (url.host.endsWith("sinaimg.cn")) {
    if (!url.pathname.startsWith("/mw690")) {
        var paths = url.pathname.split("/")
        paths[1] = "mw2000"
        url.pathname = paths.join("/")
    }
    new_href = url.toString()
} else if (url.host === "link.zhihu.com") {
    new_href = url.searchParams.get("target").replace("%3A", ":")
} else if (url.host === "c.tieba.baidu.com") {
    url.host = "tieba.baidu.com"
    url.pathname = url.pathname.replace("/good", "")
    new_href = url.toString()
} else if (url.host === "pro.m.jd.com") {
    new_href = current_href.replace("m.", "")
} else if (url.host === "m.weibo.cn") {
    // https://m.weibo.cn/u/5271269026
    new_href = current_href.replace("m.", "")
    new_href = new_href.replace(".cn", ".com")
    new_href = new_href.replace("/u/", "/")
} else if (url.host === "m.thepaper.cn") {
    // https://m.thepaper.cn/kuaibao_detail.jsp?contid=25347899&from=kuaibao
    // https://www.thepaper.cn/newsDetail_forward_25347899
    if (url.pathname.includes("newsDetail_forward")) {
        url.host = "www.thepaper.cn"
        new_href = url.href
    } else {
        cont_id = url.searchParams.get("contid")
        new_href = `https://www.thepaper.cn/newsDetail_forward_${cont_id}`
    }
}
console.log(new_href)
replace_url(current_href, new_href)
