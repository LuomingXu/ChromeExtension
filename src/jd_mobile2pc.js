var current_href = window.location.href;

// https://item.m.jd.com/product/31815069118.html

if (current_href.includes("item.m.jd.com")) {
    var new_href = current_href.replace("m.", "")
    new_href = new_href.replace("/product", "")

    window.location.replace(new_href)
}
