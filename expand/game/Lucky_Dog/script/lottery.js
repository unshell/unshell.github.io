class Lottery {
    constructor(price) {
        // 售价
        this.price = price;
        // 是否揭晓
        this.show = false;
        // 类型
        switch (price) {
            case 1:
                this.name = '点点福';
                this.probability = 1;
                this.reward = [2, 2, 2, 2, 2, 2, 3, 3, 3, 5];
                break;
            case 5:
                this.name = '五喜彩';
                this.probability = 0.8;
                this.reward = [5, 5, 5, 5, 10, 10, 15, 15, 30, 30];
                break;
            case 10:
                this.name = '十分好运';
                this.probability = 0.7;
                this.reward = [10, 10, 10, 20, 20, 20, 40, 40, 80, 80];
                break;
            case 20:
                this.name = '双喜临门';
                this.probability = 0.7;
                this.reward = [20, 20, 40, 40, 40, 40, 80, 100, 150, 200];
                break;
            case 50:
                this.name = '金运满堂';
                this.probability = 0.5;
                this.reward = [50, 50, 100, 100, 100, 100, 250, 300, 400, 500];
                break;
        }
    }
    static ui() {
        const sell = document.getElementById('lottery'),
            types = {
                1: '点点福',
                5: '五喜彩',
                10: '十分好运',
                20: '双喜临门',
                50: '金运满堂',
            };
        sell.innerHTML = ''; // 清空售卖台

        for (const key in types) {
            const item = document.createElement('div'),
                price = Number(key);
            item.className = 'lottery';
            if (LD.money < price) {
                item.classList.add('disabled');
            } else {
                item.classList.remove('disabled');
            }
            item.innerHTML = `
                <p>${types[price]}</p>
                <p>$ ${price}</p>
            `;
            item.onclick = () => Lottery.buy(price);
            sell.appendChild(item);
        }

        const desktop = document.getElementById('desktop');
        desktop.dataset.legend = `桌面（${desktop.dataset.count} / ${desktop.dataset.max}）`;

        const tool = document.getElementById('tool');
        if (LD.bag.fan) {
            tool.style.display = 'block';
            const fan = tool.querySelector('.fan'), switchFan = () => {
                if (!LD.bag.fan.open && LD.bag.fan.count <= 0) return;
                const spans = document.querySelectorAll('.fan span');
                spans[0].classList.toggle('rotate-loop');
                let open = spans[0].classList.contains('rotate-loop');
                spans[1].innerHTML = '风扇: ' + (open ? '开' : '关');
                LD.bag.fan.open = open ? true : false;
            };
            if (fan) {
                let width = LD.bag.fan.count;
                fan.style.setProperty('--after-width', `${width}%`);
                if (width < 70) {
                    fan.style.setProperty('--after-color', '#e6a23c');
                } else if (width < 30) {
                    fan.style.setProperty('--after-color', '#f56c6c');
                } else if (width <= 0) {
                    switchFan();
                }
            } else {
                const fan = document.createElement('div');
                fan.className = 'fan';
                fan.title = '自动将刮完的彩票移至垃圾桶';
                fan.style.cursor = 'pointer';
                fan.innerHTML = `<span>十</span><span>风扇: 关</span>`;
                fan.onclick = switchFan;
                tool.appendChild(fan);
            }
        }
    }
    static buy(price) {
        const desktop = document.getElementById('desktop'),
            lottery = document.createElement('div'),
            LT = new Lottery(price);

        // 桌面限制
        if (Number(desktop.dataset.count) >= Number(desktop.dataset.max)) {
            desktop.dataset.legend = `桌面已满，请清理桌面`;
            setTimeout(() => Lottery.ui(), 2000);
            return;
        }
        desktop.dataset.count = Number(desktop.dataset.count) + 1;

        if (LD.money < price) return;
        LD.money -= price;
        LD.update();
        Lottery.ui();

        LT.open(LD.lucky);
        lottery.className = 'lottery';
        lottery.title = `在隐藏区域长按鼠标左键刮除`;
        lottery.innerHTML = `
                    <p>${LT.name}</p>
                    <p>${LT.reward}</p>
                    <p>\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\</p>
                `;
        // 随机位置
        lottery.style.position = 'absolute';
        lottery.style.left = `${Math.floor(Math.random() * 40) + 20}%`;
        lottery.style.top = `${Math.floor(Math.random() * 40) + 20}%`;
        lottery.style.backgroundColor = '#fff';
        desktop.appendChild(lottery);

        // 拖动
        let isDragging = false,
            startX, startY, origLeft, origTop;

        // 按下鼠标
        lottery.querySelector('p:nth-child(1)').addEventListener('mousedown', e => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            origLeft = lottery.offsetLeft;
            origTop = lottery.offsetTop;
            // 防止选中文字
            e.preventDefault();
        });

        // 移动鼠标
        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            lottery.style.left = origLeft + dx + 'px';
            lottery.style.top = origTop + dy + 'px';
        });

        // 松开鼠标
        document.addEventListener('mouseup', e => {
            isDragging = false;

            // 检查是否拖拽到垃圾桶
            const trash = document.querySelector('#desktop .trash');
            if (trash) {
                const lotteryRect = lottery.getBoundingClientRect();
                const trashRect = trash.getBoundingClientRect();

                // 计算彩票中心点
                const lotteryCenterX = lotteryRect.left + lotteryRect.width / 2;
                const lotteryCenterY = lotteryRect.top + lotteryRect.height / 2;

                // 检查中心点是否在垃圾桶范围内
                if (
                    lotteryCenterX >= trashRect.left &&
                    lotteryCenterX <= trashRect.right &&
                    lotteryCenterY >= trashRect.top &&
                    lotteryCenterY <= trashRect.bottom
                ) {
                    // 删除彩票元素
                    lottery.remove();
                    // 桌面限制
                    desktop.dataset.count = Number(desktop.dataset.count) - 1;
                    Lottery.ui();
                }
            }
        });


        let timer = null;
        // 左键按下
        lottery.querySelector('p:nth-child(3)').addEventListener('mousedown', (e) => {
            timer = setInterval(() => {
                if (LT.show) return;
                let ih = lottery.children[2].innerHTML, ihl = ih.length;
                if (ihl <= 7) {
                    lottery.children[2].innerHTML = '';
                    if (LT.reward > 0) {
                        LD.money += LT.reward;
                        LD.update();
                    }
                    LT.show = !LT.show;
                    if (LD.bag.fan && LD.bag.fan.open) {
                        LD.bag.fan.count--;
                        desktop.dataset.count = Number(desktop.dataset.count) - 1;
                        lottery.remove(); // 刮完自动进垃圾桶
                    }
                    Lottery.ui();
                } else {
                    lottery.children[2].innerHTML = ih.replace(/\\/, '');
                }
            }, 100);
        }, false);
        // 取消按下
        ['mouseup', 'mouseleave'].forEach(e => {
            lottery.querySelector('p:nth-child(3)').addEventListener(e, () => clearInterval(timer));
        });
    }
    // 开奖
    open(weight) {
        if (!this.reward instanceof Array) return this.reward;
        // 权重
        weight = weight / 100 * this.probability;
        // 随机数
        let random = Math.random();
        // 如果随机数小于权重，说明中奖
        if (random < weight) {
            // 中奖
            this.reward = this.reward[Math.floor(Math.random() * 10)];
        } else {
            this.reward = 0;
        }
    }
}