class Work {
    constructor() {
    }

    static ui() {
        const work = document.getElementById('work');
        work.innerHTML = '';

        // 创建打工选项容器
        const workOptions = document.createElement('div');
        workOptions.className = 'work-options';

        // 洗碗选项
        const washDishItem = document.createElement('div');
        washDishItem.className = 'work-item';
        washDishItem.innerHTML = `
            <p>🍽️ 洗碗工</p>
            <p>清洗盘子上的污渍</p>
            <p>奖励: $5 / 盘子</p>
            <p>消耗: 3 体力</p>
            <button class="work-btn" id="wash-dish-btn">开始洗碗</button>
        `;
        workOptions.appendChild(washDishItem);

        // 送外卖选项
        const deliveryItem = document.createElement('div');
        deliveryItem.className = 'work-item';
        
        // 检查是否拥有手机
        const hasPhone = LD.bag.phone !== null && LD.bag.phone !== undefined;
        
        if (hasPhone) {
            deliveryItem.innerHTML = `
                <p>🛵 外卖员</p>
                <p>送外卖赚取小费</p>
                <p>奖励: 随机 $10-30</p>
                <p>消耗: 5 体力</p>
                <button class="work-btn" id="delivery-btn">开始送外卖</button>
            `;
        } else {
            deliveryItem.innerHTML = `
                <p>🛵 外卖员 (未解锁)</p>
                <p>需要购买手机才能解锁</p>
                <p>去商城购买手机吧！</p>
                <button class="work-btn" disabled>未解锁</button>
            `;
            deliveryItem.classList.add('locked');
        }
        workOptions.appendChild(deliveryItem);

        work.appendChild(workOptions);

        // 洗碗工作区域
        const dishArea = document.createElement('div');
        dishArea.id = 'dish-area';
        dishArea.className = 'dish-area';
        dishArea.style.display = 'none';
        work.appendChild(dishArea);

        // 送外卖工作区域
        const deliveryArea = document.createElement('div');
        deliveryArea.id = 'delivery-area';
        deliveryArea.className = 'delivery-area';
        deliveryArea.style.display = 'none';
        work.appendChild(deliveryArea);

        // 绑定按钮事件
        const washDishBtn = document.getElementById('wash-dish-btn');
        if (washDishBtn) {
            washDishBtn.onclick = () => Work.startWashDish();
        }

        const deliveryBtn = document.getElementById('delivery-btn');
        if (deliveryBtn) {
            deliveryBtn.onclick = () => Work.startDelivery();
        }
    }

    // 开始洗碗
    static startWashDish() {
        // 检查体力
        if (LD.energy < 3) {
            alert('体力不足！需要至少3点体力');
            return;
        }

        const workOptions = document.querySelector('.work-options');
        const dishArea = document.getElementById('dish-area');
        
        workOptions.style.display = 'none';
        dishArea.style.display = 'block';
        dishArea.innerHTML = '';

        // 创建盘子
        const plate = document.createElement('div');
        plate.className = 'plate';
        
        // 随机生成3-5个污渍
        const stainCount = Math.floor(Math.random() * 3) + 3;
        const stains = [];
        
        for (let i = 0; i < stainCount; i++) {
            const stain = document.createElement('div');
            stain.className = 'stain';
            stain.innerHTML = 'ZZZZZZZ';
            
            // 随机位置（在圆盘范围内）
            const angle = (Math.PI * 2 * i) / stainCount;
            const radius = 30 + Math.random() * 20;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            
            stain.style.left = x + '%';
            stain.style.top = y + '%';
            stain.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
            
            plate.appendChild(stain);
            stains.push(stain);
        }

        // 添加返回按钮
        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.innerHTML = '返回';
        backBtn.onclick = () => {
            dishArea.style.display = 'none';
            workOptions.style.display = 'flex';
        };
        dishArea.appendChild(backBtn);
        dishArea.appendChild(plate);

        // 污渍清理逻辑
        let cleanedCount = 0;
        const totalStains = stains.length;

        stains.forEach(stain => {
            let cleanTimer = null;
            let cleanProgress = 0;

            stain.addEventListener('mousedown', (e) => {
                e.preventDefault();
                cleanTimer = setInterval(() => {
                    cleanProgress += 10;
                    stain.style.opacity = 1 - (cleanProgress / 100);
                    
                    if (cleanProgress >= 100) {
                        clearInterval(cleanTimer);
                        stain.remove();
                        cleanedCount++;
                        
                        // 所有污渍清理完成
                        if (cleanedCount >= totalStains) {
                            setTimeout(() => {
                                // 扣除体力，增加资产
                                LD.energy -= 3;
                                LD.money += 5;
                                LD.update();
                                
                                // 显示完成信息
                                plate.innerHTML = '<div class="plate-complete">✓ 清洗完成！+$5</div>';
                                
                                setTimeout(() => {
                                    dishArea.style.display = 'none';
                                    workOptions.style.display = 'flex';
                                    Work.ui(); // 刷新UI
                                }, 1500);
                            }, 300);
                        }
                    }
                }, 50);
            });

            ['mouseup', 'mouseleave'].forEach(event => {
                stain.addEventListener(event, () => {
                    if (cleanTimer) {
                        clearInterval(cleanTimer);
                        cleanTimer = null;
                        // 重置进度
                        if (cleanProgress < 100) {
                            stain.style.opacity = 1;
                            cleanProgress = 0;
                        }
                    }
                });
            });
        });
    }

    // 开始送外卖
    static startDelivery() {
        // 检查体力
        if (LD.energy < 5) {
            alert('体力不足！需要至少5点体力');
            return;
        }

        const workOptions = document.querySelector('.work-options');
        const deliveryArea = document.getElementById('delivery-area');
        
        workOptions.style.display = 'none';
        deliveryArea.style.display = 'block';
        deliveryArea.innerHTML = '';

        // 创建外卖游戏区域
        const gameArea = document.createElement('div');
        gameArea.className = 'delivery-game';
        
        // 创建地图
        const map = document.createElement('div');
        map.className = 'delivery-map';
        
        // 起点（餐厅）
        const startPoint = document.createElement('div');
        startPoint.className = 'delivery-point start';
        startPoint.innerHTML = '🏪';
        startPoint.style.left = '10%';
        startPoint.style.top = '50%';
        map.appendChild(startPoint);
        
        // 终点（客户）
        const endPoint = document.createElement('div');
        endPoint.className = 'delivery-point end';
        endPoint.innerHTML = '🏠';
        endPoint.style.left = '80%';
        endPoint.style.top = '50%';
        map.appendChild(endPoint);
        
        // 外卖员
        const rider = document.createElement('div');
        rider.className = 'delivery-rider';
        rider.innerHTML = '🛵';
        rider.style.left = '10%';
        rider.style.top = '50%';
        map.appendChild(rider);
        
        // 障碍物
        for (let i = 0; i < 5; i++) {
            const obstacle = document.createElement('div');
            obstacle.className = 'delivery-obstacle';
            obstacle.innerHTML = '🚧';
            obstacle.style.left = (20 + Math.random() * 60) + '%';
            obstacle.style.top = (20 + Math.random() * 60) + '%';
            map.appendChild(obstacle);
        }
        
        gameArea.appendChild(map);
        
        // 添加返回按钮
        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.innerHTML = '返回';
        backBtn.onclick = () => {
            deliveryArea.style.display = 'none';
            workOptions.style.display = 'flex';
        };
        gameArea.appendChild(backBtn);
        
        // 添加说明
        const instruction = document.createElement('p');
        instruction.className = 'delivery-instruction';
        instruction.innerHTML = '点击地图移动外卖员，避开障碍物，到达目的地！';
        gameArea.appendChild(instruction);
        
        deliveryArea.appendChild(gameArea);

        // 游戏逻辑
        let riderPos = { x: 10, y: 50 };
        let isGameOver = false;

        map.addEventListener('click', (e) => {
            if (isGameOver) return;
            
            const rect = map.getBoundingClientRect();
            const targetX = ((e.clientX - rect.left) / rect.width) * 100;
            const targetY = ((e.clientY - rect.top) / rect.height) * 100;
            
            // 移动动画
            rider.style.left = targetX + '%';
            rider.style.top = targetY + '%';
            riderPos = { x: targetX, y: targetY };
            
            // 检查是否到达终点
            const distToEnd = Math.sqrt(
                Math.pow(targetX - 80, 2) + Math.pow(targetY - 50, 2)
            );
            
            if (distToEnd < 10) {
                isGameOver = true;
                const reward = Math.floor(Math.random() * 21) + 10; // 10-30随机
                
                setTimeout(() => {
                    LD.energy -= 5;
                    LD.money += reward;
                    LD.update();
                    
                    map.innerHTML = `<div class="delivery-complete">送达成功！+$${reward}</div>`;
                    
                    setTimeout(() => {
                        deliveryArea.style.display = 'none';
                        workOptions.style.display = 'flex';
                        Work.ui();
                    }, 2000);
                }, 500);
            }
            
            // 检查是否撞到障碍物
            document.querySelectorAll('.delivery-obstacle').forEach(obstacle => {
                const obsX = parseFloat(obstacle.style.left);
                const obsY = parseFloat(obstacle.style.top);
                const dist = Math.sqrt(
                    Math.pow(targetX - obsX, 2) + Math.pow(targetY - obsY, 2)
                );
                
                if (dist < 8) {
                    isGameOver = true;
                    setTimeout(() => {
                        map.innerHTML = '<div class="delivery-fail">撞到障碍物！任务失败</div>';
                        
                        setTimeout(() => {
                            deliveryArea.style.display = 'none';
                            workOptions.style.display = 'flex';
                            Work.ui();
                        }, 2000);
                    }, 300);
                }
            });
        });
    }
}
