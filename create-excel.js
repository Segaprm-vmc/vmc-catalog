const XLSX = require('xlsx');

const data = [
  ['Название характеристики', 'Значение'],
  ['Двигатель', '4-тактный, одноцилиндровый'],
  ['Объем двигателя', '250 куб.см'],
  ['Мощность', '25 л.с.'],
  ['Максимальная скорость', '140 км/ч'],
  ['Расход топлива', '3.5 л/100км'],
  ['Вес', '140 кг'],
  ['Высота по седлу', '800 мм'],
  ['Объем топливного бака', '12 л']
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(data);
XLSX.utils.book_append_sheet(wb, ws, 'Характеристики');
XLSX.writeFile(wb, 'public/example_specs.xlsx');
console.log('Excel файл создан!'); 