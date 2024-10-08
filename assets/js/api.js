/**
 * List repository issues
 * 
 * @param {*} success 成功的回调
 */
function issues(success) {
    $.ajax({
        url: 'https://api.github.com/repos/unshell/posts/issues',
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
        url: 'https://api.github.com/repos/unshell/posts/issues/' + number,
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
    var $icon = $('svg[data-theme="' + theme + '"]');
    $('body').removeClass().addClass(theme);
    $('svg.icon').removeClass('active');
    $icon.addClass('active');
}

/* Document click */
$(document).on('click', 'svg.icon', function () {
    var $this = $(this), $sibling = $this.siblings('svg.icon'), data = $sibling.data(), theme = data.theme;
    $this.removeClass('active').siblings('svg.icon').addClass('active');
    localStorage.setItem('theme', theme);
    setTheme();
});