const global = {
    maps: ['主卧', '厨房', '客厅', '地下室', '次卧', '阳台', '书房'],
}

global.maps.sort(() => Math.random() - 0.5)

console.log(global)