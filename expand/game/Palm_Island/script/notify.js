const notify = {
    // 消息盒
    box: $('.notifications'),
    // 消息列表
    list: [
        {
            text: '你从昏迷中醒来.',
            duration: 3000
        },
        {
            text: '这是在?',
            duration: 3000
        },
        {
            text: '在一座岛屿上?',
            duration: 1000
        },
        {
            text: '我知道这里.',
            duration: 1000
        },
        {
            text: '是一座无人岛，但会有渔民经过.',
            duration: 2000
        },
        {
            text: '我要做的就是活到那个时候.',
            duration: 3000
        },
        {
            text: '这么多棕榈树我应该可以做些什么.',
            duration: 2000
        }
    ],
    // 创建消息
    create: function (text, duration, callback) {
        var $div = $('<div class="notification"></div>');
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