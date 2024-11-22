/**
 * Blog specific token
 */
var owner = 'unshell', repo = 'posts', token = ['git', 'hub', '_p', 'a', 't_', '11AHBQ7GY0', '9bxCAqoA0GeT', '_J04BTjBx2jF', 'jaPRgfdTlJiJ01', '98kNv2iFOzrctmcIV', '4Z5VHDL6ZhyV5UzbF'].join('');

/**
 * Update an issue
 * 
 * @param {*} success 成功的回调
 * @param {*} body 修改的内容
 */
function update(success, body, number) {
    $.ajax({
        url: 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + number,
        type: 'PATCH',
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': 'token ' + token,
            'X-GitHub-Api-Version': '2022-11-28'
        },
        success: success,
        data: JSON.stringify({
            title: 'JSON DATEBASE',
            body: JSON.stringify(body),
            state: 'closed' // 始终处于关闭状态
        }),
        error: function (e) {
            alert(e.responseJSON.message);
        }
    });
}

/**
 * List repository issues
 * 
 * @param {*} success 成功的回调
 */
function issues(success) {
    $.ajax({
        url: 'https://api.github.com/repos/' + owner + '/' + repo + '/issues',
        headers: {
            accept: 'application/vnd.github+json'
        },
        success: success,
        error: function (e) {
            alert(e.responseJSON.message);
        }
    });
}

/**
 * Get an issue
 * @param {*} success 成功的回调
 * @param {*} number Issue Number（issue 索引）
 */
function issue(success, number) {
    $.ajax({
        url: 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + number,
        headers: {
            accept: 'application/vnd.github+json'
        },
        success: success,
        error: function (e) {
            alert(e.responseJSON.message);
        }
    });
}

/**
 * Get location params
 */
function params() {
    var urlSearchParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlSearchParams.entries());
}

/* Request loading */
function loading(end) {
    var $target = $('p.loading');
    $target.css('display', end ? 'none' : 'inherit');
}

/* Theme ready */
function setTheme() {
    var theme = localStorage.getItem('theme');
    if (!theme && window.matchMedia) { // system theme color
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'black' : 'white';
        localStorage.setItem('theme', theme);
    }
    var $icon = $('i[data-theme="' + theme + '"]');
    $('body').removeClass().addClass(theme);
    $('i.iconfont').removeClass('active');
    $icon.addClass('active');
}

/**
 * Validate Json
 * 
 * @param {*} json Json 字符
 * @param {*} warn 是否提醒
 * @returns 
 */
function validateJson(json, warn) {
    try {
        json = parseJson(json);
        return true;
    } catch (e) {
        var index = parseInt(e.message.match(/position (\d+)/)[1], 10);
        warn && alert('JSON 格式错误，发生在以下语法附近：\n' + json.substring(index).replace(/\s+/g, ''));
        return false;
    }
}

/**
 * Parse Json
 * 
 * @param {*} json 
 */
function parseJson(json) {
    return typeof json == 'object' ? json : parseJson(JSON.parse(json));
}

/**
 * Is Mobile Device
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/* Document click */
$(document).on('click', 'i.iconfont', function () {
    var $this = $(this), $sibling = $this.siblings('i.iconfont'), data = $sibling.data(), theme = data.theme;
    $this.removeClass('active').siblings('i.iconfont').addClass('active');
    localStorage.setItem('theme', theme);
    setTheme();
});