class LuckyDog {
    constructor() {
        // 健康值
        this.health = 100;
        // 健康最大值
        this.healthMax = 100;
        // 幸运值
        this.lucky = 50;
        // 幸运最大值
        this.luckyMax = 100;
        // 体力值
        this.energy = 100;
        // 体力最大值
        this.energyMax = 100;
        // 资产
        this.money = 10;
        // 背包
        this.bag = {
            fan: null,  // 风扇需要购买后才可用
            phone: null  // 手机需要购买后才可用
        };
    }
    // 更新状态
    update() {
        const status = document.querySelector('.box[lucky-dog]');
        status.innerHTML = `
            <p class="property">健康</p>
            <p>${this.health} / ${this.healthMax}</p>
            <p class="property">体力</p>
            <p>${this.energy} / ${this.energyMax}</p>
            <p class="property">幸运</p>
            <p>${this.lucky} / ${this.luckyMax}</p>
            <p class="property">资产</p>
            <p>$ ${this.money}</p>
        `;

        const nav = document.querySelector('.nav');
        nav.innerHTML = `
            <li class="link active" data-mode="lottery">刮刮乐</li>
            <li>·</li>
            <li class="link" data-mode="shop">商城</li>
            <li>·</li>
            <li class="link" data-mode="work">打工</li>
            <li>·</li>
            <li class="link" data-mode="stock">股市</li>
        `;
        const links = nav.querySelectorAll('ul .link'), rights = document.querySelectorAll('.right');
        links.forEach(link => {
            link.onclick = () => {
                links.forEach(link => {
                    link.classList.remove('active');
                });
                rights.forEach(right => {
                    right.style.display = right.hasAttribute(link.dataset.mode) ? 'block' : 'none';
                });
                link.classList.add('active');
                
                // 切换到商城时刷新商城UI
                if (link.dataset.mode === 'shop') {
                    Shop.ui();
                }
                
                // 切换到打工时刷新打工UI
                if (link.dataset.mode === 'work') {
                    Work.ui();
                }
            }
        });
    }
}