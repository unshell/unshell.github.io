const btn = {
    init: function (options) {
        let element = document.createElement('button');
        element.innerText = options.text;
        element.onclick = options.click;
        if (options.tooltip) {
            element.classList.add('tooltip');
            element.setAttribute('data-tooltip', options.tooltip);
        }
        return element;
    }
}