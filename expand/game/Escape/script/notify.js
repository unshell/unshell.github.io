const notify = {
    // 消息盒
    box: $('.notify'),
    // 消息列表
    list: [
        {
            text: '狱警：这个点了人才送到吗？',
            duration: 2000
        },
        {
            text: '狱警：你以后就住那个房间.',
            duration: 2000
        },
        {
            text: '狱警：在这里好好改造，别想着有的没的.',
            duration: 1000
        }
    ],
    // 创建消息
    create: function (text, duration, callback) {
        var $div = $('<div class="item"></div>');
        $div.text(text);
        this.box.prepend($div);
        $div.animate({ opacity: 0 }, 0);
        $div.animate({ opacity: 1 }, duration || 1000, callback);
    },
    // 根据列表创建消息
    createByList: function (index, end) {
        var _that = this;
        if (!this.list[index]) {
            end && end();
            return;
        }
        this.create(this.list[index].text, this.list[index].duration, function () {
            _that.createByList(++index, end);
        });
    }
}