// 初始化
window.ESCAPE = {
    grid: {
        size: 24,
        enums: {
            1: '墙',
            2: '门',
            3: '床',
            4: '卫',
            5: '囚',
            6: '警',
            7: '锁'
        }
    },
    human: document.getElementById('human'),
    position: {
        y: 0
    },
    map: {
        type: 'prison'
    },
    time: {
        minute: 1020,
        formart: {
            hours: 0,
            minutes: 0,
            text: ''
        },
        action: ''
    }
};
ESCAPE.box = {
    with: ESCAPE.grid.size * 15,
    height: ESCAPE.grid.size * 15
}
ESCAPE.position.x = (ESCAPE.box.with - ESCAPE.grid.size) / 2;
ESCAPE.map = {
    type: 'prison'
}
ESCAPE.map.name = map.types[ESCAPE.map.type].name;
ESCAPE.map.grids = map.types[ESCAPE.map.type].grids[0];
document.getElementById('room').innerHTML = ESCAPE.map.name;

map.drawMap(ESCAPE.map.grids);

notify.createByList(0);

// 时间计时器
setInterval(() => {
    if (ESCAPE.time.minute >= 24 * 60) {
        ESCAPE.time.minute = 0;
    }
    ESCAPE.time.minute++;
    const hours = Math.floor(ESCAPE.time.minute / 60),
        minutes = ESCAPE.time.minute % 60;
    ESCAPE.time.formart.hours = hours;
    ESCAPE.time.formart.minutes = minutes;
    ESCAPE.time.formart.text = `⏱ ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    document.getElementById('time').innerHTML = ESCAPE.time.formart.text;
    if (ESCAPE.time.minute >= 0 && ESCAPE.time.minute < 330) {
        // 所有囚犯在牢房，禁止移动；可触发「夜间越狱尝试」「狱警巡逻检查」「牢房内小互动（藏东西）」
        ESCAPE.time.action = '深夜禁闭';
    } else if (ESCAPE.time.minute >= 330 && ESCAPE.time.minute < 360) {
        // 强制起床，狱警点名（缺席会触发警报）；可触发「装病逃避点名」「和狱警顶嘴」等小事件
        ESCAPE.time.action = '起床 / 点名';
    } else if (ESCAPE.time.minute >= 360 && ESCAPE.time.minute < 420) {
        // 食堂集中就餐；可触发「插队冲突」「藏食物」「和其他囚犯交易（用食物换物品）」
        ESCAPE.time.action = '早餐时间';
    } else if (ESCAPE.time.minute >= 420 && ESCAPE.time.minute < 690) {
        // 核心工作时间（如工厂做工、农场干活、打扫卫生）；可触发「偷懒被惩罚」「偷偷收集工具」「和工头周旋」
        ESCAPE.time.action = '上午劳作';
    } else if (ESCAPE.time.minute >= 690 && ESCAPE.time.minute < 810) {
        // 食堂就餐，比早餐时间长；可触发「帮派拉拢」「向厨师行贿」「获取关键情报」
        ESCAPE.time.action = '午餐 / 午休';
    } else if (ESCAPE.time.minute >= 810 && ESCAPE.time.minute < 1020) {
        // 同上午劳作，但难度 / 监管强度略低；可触发「完成工作获取积分」「故意损坏工具」「和囚犯合作偷懒」
        ESCAPE.time.action = '下午劳作';
    } else if (ESCAPE.time.minute >= 1020 && ESCAPE.time.minute < 1200) {
        // 食堂就餐；可触发「报复白天冲突的囚犯」「和食堂人员接头」「藏违禁品在食物里」
        // 图书馆看书、公共区聊天（监管宽松）；可触发「找越狱相关书籍」「和知识分子囚犯交流」「传递消息」
        ESCAPE.time.action = '晚餐 / 自由活动';
    } else if (ESCAPE.time.minute >= 1200 && ESCAPE.time.minute < 1260) {
        // 洗漱 + 狱警最终点名；可触发「趁点名混乱藏东西」「假装生病去医务室」「最后一次和外界（律师）接触」
        ESCAPE.time.action = '洗漱 / 晚点名';
    } else if (ESCAPE.time.minute >= 1260 && ESCAPE.time.minute < 1440) {
        // 回到牢房，仅狱警巡逻；可触发「熬夜策划越狱」「牢房内制造工具」「被其他囚犯举报」
        ESCAPE.time.action = '夜间禁闭';
    }
    document.getElementById('action').innerHTML = ESCAPE.time.action;
}, 500);

// 重制人位置
window.ESCAPE.human.style.left = ESCAPE.position.x + 'px';
window.ESCAPE.human.style.bottom = ESCAPE.position.y + 'px';

// 监听键盘事件
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (ESCAPE.human) {
        const computedStyle = window.getComputedStyle(ESCAPE.human);
        if (['w', 's', 'a', 'd'].includes(key)) {
            const humanStyle = ESCAPE.human.style, { top, left } = computedStyle;
            const topInt = parseInt(top), leftInt = parseInt(left), gridSize = ESCAPE.grid.size;
            switch (key) {
                case 'w':
                    if (topInt <= 0) break;
                    if (!map.isPassable(ESCAPE.map.grids, topInt - gridSize, leftInt)) break;
                    humanStyle.top = topInt - gridSize + 'px';
                    break;
                case 's':
                    if ((topInt + gridSize) >= ESCAPE.box.height) break;
                    if (!map.isPassable(ESCAPE.map.grids, topInt + gridSize, leftInt)) break;
                    humanStyle.top = topInt + gridSize + 'px';
                    break;
                case 'a':
                    if (leftInt <= 0) break;
                    if (!map.isPassable(ESCAPE.map.grids, topInt, leftInt - gridSize)) break;
                    humanStyle.left = leftInt - gridSize + 'px';
                    break;
                case 'd':
                    if ((leftInt + gridSize) >= ESCAPE.box.with) break;
                    if (!map.isPassable(ESCAPE.map.grids, topInt, leftInt + gridSize)) break;
                    humanStyle.left = leftInt + gridSize + 'px';
                    break;
            }
        }

        if (key === 'j') {
            
        }
    }
});