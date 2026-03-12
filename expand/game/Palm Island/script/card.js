// 卡牌
const card = {
    // 类型
    types: {
        canoe_house: {
            number: 3,
            type: 'canoe_house',
            name: '捕鱼小屋',
            content: [
                {
                    get: { fish: 1 },
                    rotate: { fish: 1 },
                    flip: { fish: 1 }
                },
                {
                    get: { fish: 2 },
                    flip: { wood: 1, fish: 1 }
                },
                {
                    get: { wood: 1, fish: 1 },
                    rotate: { wood: 1, fish: 1 }
                },
                {
                    get: { wood: 1, fish: 2 }
                }
            ],
            level: 1
        },
        quarry: {
            number: 3,
            type: 'quarry',
            name: '采石场',
            content: [
                {
                    rotate: { wood: 2 },
                    flip: { fish: 2 }
                },
                {
                    get: { stone: 1 },
                    flip: { wood: 2, fish: 1 }
                },
                {
                    get: { stone: 1 },
                    rotate: { wood: 1, fish: 2 }
                },
                {
                    get: { stone: 2 },
                    build: 2
                }
            ],
            level: 1
        },
        trade_house: {
            number: 1,
            type: 'trade_house',
            name: '贸易所',
            content: [
                {
                    get: { wood: 1, fish: 1 },
                    exchange: [
                        { wood: 2 },
                        { fish: 2 }
                    ],
                    rotate: { fish: 1 },
                    flip: { wood: 1 }
                },
                {
                    get: { wood: 3 },
                    exchange: [
                        { fish: 2 },
                        { stone: 2 }
                    ],
                    flip: { wood: 1, fish: 1 }
                },
                {
                    get: { fish: 3 },
                    exchange: [
                        { wood: 2 },
                        { stone: 2 }
                    ],
                    rotate: { wood: 1, fish: 1 }
                },
                {
                    get: { stone: 3 },
                    exchange: [
                        { fish: 2 },
                        { wood: 2 }
                    ],
                    flip: { stone: 1 },
                    rotate: { stone: 1 }
                }
            ],
            level: 1
        },
        logger: {
            number: 3,
            type: 'logger',
            name: '伐木场',
            content: [
                {
                    get: { wood: 1 },
                    rotate: { wood: 1, fish: 1 }
                },
                {
                    get: { wood: 1 },
                    flip: { wood: 1, stone: 1 },
                    build: 1
                },
                {
                    build: 5
                },
                {
                    get: { wood: 2 },
                    rotate: { wood: 2, stone: 2 },
                    build: 2
                }
            ]
        },
        temple: {
            number: 2,
            type: 'temple',
            name: '寺庙',
            content: [
                {
                    rotate: { wood: 1, fish: 1, stone: 2 }
                },
                {
                    flip: { wood: 2, fish: 2, stone: 3 },
                    build: 3
                },
                {
                    build: 10
                },
                {
                    rotate: { wood: 3, fish: 3, stone: 4 },
                    build: 6
                }
            ]
        },
        tool_maker: {
            number: 1,
            type: 'tool_maker',
            name: '工具间',
            content: [
                {
                    flip: { wood: 1, fish: 1 },
                    rotate: { wood: 1, fish: 1, stone: 2 }
                },
                {
                    build: 4
                },
                {
                    get: { wood: 1, fish: 1 },
                    rotate: { wood: 1, fish: 1, stone: 1 }
                },
                {
                    get: { wood: 1, fish: 1, stone: 1 },
                    flip: { wood: 2, fish: 2, stone: 2 }
                }
            ]
        },
        housing: {
            number: 2,
            type: 'housing',
            name: '住宅',
            content: [
                {
                    rotate: { wood: 1, fish: 1 }
                },
                {
                    flip: { wood: 1, fish: 1, stone: 1 },
                    build: 1
                },
                {
                    build: 6
                },
                {
                    rotate: { wood: 2, fish: 2, stone: 2 },
                    build: 3
                }
            ]
        },
        market: {
            number: 1,
            type: 'market',
            name: '市场',
            content: [
                {
                    get: { stone: 1 },
                    exchange: [
                        { wood: 1 },
                        { fish: 1 }
                    ],
                    rotate: { wood: 2 },
                    flip: { fish: 2 }
                },
                {
                    get: { fish: 1, stone: 1 },
                    exchange: [
                        { wood: 1 }
                    ],
                    flip: { wood: 1, stone: 1 },
                    build: 2
                },
                {
                    get: { wood: 1, stone: 1 },
                    exchange: [
                        { fish: 1 }
                    ],
                    flip: { stone: 1, fish: 1 }
                },
                {
                    get: { wood: 1, fish: 1, stone: 1 },
                    exchange: [
                        { wood: 1 },
                        { fish: 1 },
                        { stone: 1 }
                    ],
                }
            ]
        },
        round: {
            number: 1,
            name: '轮次卡',
            min: 1,
            max: 8
        }
    },
    /**
     * 初始化卡牌
     * 
     * @param {*} order 按序排列
     */
    init: function (order) {
        let cards = [];
        for (const key in card.types) {
            let type = card.types[key];
            if (!type.content) continue;
            for (let i = 0; i < type.number; i++) {
                type.id = key + '_' + (i + 1);
                cards.push(JSON.parse(JSON.stringify(type)));
            }
        }
        if (!order) { // 打乱顺序
            cards.sort(() => Math.random() - 0.5)
        }
        cards.push(card.types.round);
        return cards;
    },
    /**
     * 行动内容文本
     * 
     * @param {Object} action 行动
     */
    toText: function (action) {
        let resources = [];
        if (typeof action !== 'object') return '';
        if (Array.isArray(action)) {
            for (var i = 0, t = ''; i < action.length; i++) {
                if (i > 0) t += ' 或 ';
                t += this.toText(action[i]);
            }
            return t;
        } else {
            for (const key in action) {
                switch (key) {
                    case 'fish':
                        resources.push(`鱼 x ${action[key]}`);
                        break;
                    case 'wood':
                        resources.push(`木头 x ${action[key]}`);
                        break;
                    case 'stone':
                        resources.push(`石头 x ${action[key]}`);
                        break;
                }
            }
        }
        return resources.join('，');
    }
}
