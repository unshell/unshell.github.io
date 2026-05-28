class Shop {
    constructor() {
    }
    static ui() {
        const shop = document.getElementById('shop');
        shop.innerHTML = '';

        // 风扇商品
        const fanItem = document.createElement('div');
        fanItem.className = 'shop-item';
        
        // 检查是否已经购买过风扇
        const hasFan = LD.bag.fan !== null && LD.bag.fan !== undefined;
        const fanCount = hasFan ? LD.bag.fan.count : 0;
        
        if (!hasFan) {
            // 未购买，显示购买按钮
            fanItem.innerHTML = `
                <p>自动风扇</p>
                <p>自动将刮完的彩票移至垃圾桶</p>
                <p>售价: $100</p>
                <button class="buy-btn" ${LD.money < 100 ? 'disabled' : ''}>购买</button>
            `;
            const buyBtn = fanItem.querySelector('.buy-btn');
            buyBtn.onclick = () => {
                if (LD.money >= 100) {
                    LD.money -= 100;
                    LD.bag.fan = {
                        count: 100,
                        open: false
                    };
                    LD.update();
                    Shop.ui();
                    Lottery.ui();
                }
            };
        } else if (fanCount <= 0) {
            // 已购买但count用完，显示维修按钮
            fanItem.innerHTML = `
                <p>自动风扇</p>
                <p>自动将刮完的彩票移至垃圾桶</p>
                <p>状态: 需要维修</p>
                <p>维修费: $50</p>
                <button class="repair-btn" ${LD.money < 50 ? 'disabled' : ''}>维修</button>
            `;
            const repairBtn = fanItem.querySelector('.repair-btn');
            repairBtn.onclick = () => {
                if (LD.money >= 50) {
                    LD.money -= 50;
                    LD.bag.fan.count = 100;
                    LD.bag.fan.open = false;
                    LD.update();
                    Shop.ui();
                    Lottery.ui();
                }
            };
        } else {
            // 已购买且正常使用中
            fanItem.innerHTML = `
                <p>自动风扇</p>
                <p>自动将刮完的彩票移至垃圾桶</p>
                <p>状态: 正常使用中</p>
                <p>剩余次数: ${fanCount}</p>
                <button disabled>已拥有</button>
            `;
        }
        
        shop.appendChild(fanItem);

        // 手机商品
        const phoneItem = document.createElement('div');
        phoneItem.className = 'shop-item';
        
        // 检查是否已经购买过手机
        const hasPhone = LD.bag.phone !== null && LD.bag.phone !== undefined;
        
        if (!hasPhone) {
            // 未购买，显示购买按钮
            phoneItem.innerHTML = `
                <p>📱 智能手机</p>
                <p>解锁送外卖工作</p>
                <p>售价: $200</p>
                <button class="buy-btn" ${LD.money < 200 ? 'disabled' : ''}>购买</button>
            `;
            const buyBtn = phoneItem.querySelector('.buy-btn');
            buyBtn.onclick = () => {
                if (LD.money >= 200) {
                    LD.money -= 200;
                    LD.bag.phone = {
                        owned: true
                    };
                    LD.update();
                    Shop.ui();
                    Work.ui(); // 刷新打工UI以解锁送外卖
                }
            };
        } else {
            // 已购买
            phoneItem.innerHTML = `
                <p>📱 智能手机</p>
                <p>解锁送外卖工作</p>
                <p>状态: 已拥有</p>
                <button disabled>已拥有</button>
            `;
        }
        
        shop.appendChild(phoneItem);
    }
}
