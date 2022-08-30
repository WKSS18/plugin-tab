// 初始化配置
$(function () {
    //
})

// 获取当前选项卡ID
function getCurrentTabId(callback) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

// 向content-script注入JS片段
function executeScriptToCurrentTab(code) {
    getCurrentTabId((tabId) => {
        chrome.tabs.executeScript(tabId, {
            code: code
        }, () => {
            chrome.tabs.update(tabId)
        });
    });
}
// 修改背景色
$('#changeBgColor').click(() => {
    let bgIcon = document.querySelector(".bgHide")
    bgIcon.style.display = bgIcon.style.display == 'none' ? 'inline-block' : 'none'
    executeScriptToCurrentTab(`
    if(document.querySelector('#rs')){
        document.body.removeChild(document.querySelector('#rs'))
    }else{
        bgDiv = document.createElement("div");
        bgDiv.style.position = 'fixed';
        bgDiv.style.width = '100%';
        bgDiv.style.height = '100%';
        bgDiv.style.zIndex = '10000';
        bgDiv.setAttribute("id","rs")
        bgDiv.style.top=0;
        bgDiv.style.left=0;
        bgDiv.style.opacity = 0.4;
        bgDiv.style.pointerEvents="none";
        bgDiv.style.backgroundColor="rgba(199,237,204,0.8)";
        document.body.appendChild(bgDiv)
    }
    `)
});

// 修改背景图片
$('#changeBgImg').click(() => {
    let bIIcon = document.querySelector(".bIHide")
    bIIcon.style.display = bIIcon.style.display == 'none' ? 'inline-block' : 'none'
    executeScriptToCurrentTab(
        `
        if (document.querySelector('#ts')) {
            document.body.removeChild(document.querySelector('#ts'))
        }else{
            bgImg = document.createElement("img");
            bgImg.src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpicture.ik123.com%2Fuploads%2Fallimg%2F200529%2F4-2005291AS5.jpg&refer=http%3A%2F%2Fpicture.ik123.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664101103&t=762da2e70fa798add796f3b523b28758"
            bgImg.style.opacity = 0.4;
            bgImg.style.position = 'fixed';
            bgImg.style.margin = 'auto';
            bgImg.setAttribute("id","ts")
            bgImg.style.width = '100%';
            bgImg.style.height = '100%';
            bgImg.style.pointerEvents="none";
            bgImg.style.zIndex = '1000';
            bgImg.style.top=0;
            bgImg.style.left=0;
            bgImg.style.backgroundSize="cover"
            document.body.appendChild(bgImg)
        }
        `
    )
});

// tab定位
$('#searchBtn').click((e) => {
    const value = $('#searchName').val()
    // 获取所有的tab标签
    chrome.tabs.query({}, function (tabs) {
        // 根据title和url模糊匹配
        const jumpUrl = tabs.find(v => v.title.includes(value) || v.url.includes(value))
        // 直接新开页
        // window.open(jumpUrl.url)
        // 定位tab页
        // 选中选项卡并切换到对应的tab select:true
        chrome.tabs.update(jumpUrl.id, {
            selected: true
        })
    });
});

// 切换图片
$('#changBgChoice').change(() => {
    let url = '';
    switch ($('#changBgChoice').val()) {
        case "1":
            url = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F8%2F59c20062ebfa4.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663990752&t=6d0ec946ab90508c730d955a6810853e'
            // url = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpicture.ik123.com%2Fuploads%2Fallimg%2F200529%2F4-2005291AS5.jpg&refer=http%3A%2F%2Fpicture.ik123.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664101103&t=762da2e70fa798add796f3b523b28758"
            break;
        case "2":
            url = 'https://s2.loli.net/2022/08/25/LMSzWqIkQAFu4Ee.jpg'
            break;
        default:
            break;
    }
    // 节点处理只能通过注入
    executeScriptToCurrentTab(
        `   
            if (document.querySelector('#ts')) {
              document.body.removeChild(document.querySelector('#ts'))
            }
            bgImg = document.createElement("img");
            bgImg.src= '${url}';
            bgImg.style.opacity = 0.2;
            bgImg.style.position = 'fixed';
            bgImg.setAttribute("id","ts")
            bgImg.style.margin = 'auto';
            bgImg.style.width = '100%';
            bgImg.style.pointerEvents="none";
            bgImg.style.height = '100%';
            bgImg.style.zIndex = '1000';
            bgImg.style.top=0;
            bgImg.style.left=0;
            bgImg.style.backgroundSize="cover"
            document.body.appendChild(bgImg)
            `
    )
})

// 添加cookie
$('#addCookieBtn').click(() => {
    if ($('#cookieKey').val() && $('#cookieValue').val()) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.cookies.set({
                url: `${tabs[0].url}`,
                name: $('#cookieKey').val(),
                value: $('#cookieValue').val()
            }, (data) => {
                if (data) {
                    alert('设置成功！')
                }
            })
        });
    } else {
        alert('请输入key,value!')
    }
})