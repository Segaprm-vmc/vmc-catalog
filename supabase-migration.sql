-- Создание таблицы для моделей мотоциклов VMC
CREATE TABLE IF NOT EXISTS vmc_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  specifications JSONB NOT NULL DEFAULT '{}',
  yandex_disk_link TEXT,
  video_frame TEXT,
  "order" INTEGER DEFAULT 999,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включение Row Level Security
ALTER TABLE vmc_models ENABLE ROW LEVEL SECURITY;

-- Политики доступа (разрешить всем читать и писать для демо)
CREATE POLICY "Allow all access to vmc_models" ON vmc_models FOR ALL USING (true);

-- Включение Realtime для таблицы
ALTER PUBLICATION supabase_realtime ADD TABLE vmc_models;

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_vmc_models_order ON vmc_models("order");
CREATE INDEX IF NOT EXISTS idx_vmc_models_created_at ON vmc_models(created_at);
CREATE INDEX IF NOT EXISTS idx_vmc_models_name ON vmc_models(name);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_vmc_models_updated_at 
    BEFORE UPDATE ON vmc_models 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Вставка данных из JSON файла
INSERT INTO vmc_models (id, name, description, images, specifications, yandex_disk_link, video_frame, "order", created_at, updated_at) VALUES
(
  'test-yamaha-r1',
  'Yamaha YZF-R1',
  '# Yamaha YZF-R1

**Флагманский спортивный мотоцикл** Yamaha с передовыми технологиями MotoGP.
Оснащен 4-цилиндровым двигателем объемом 998 см³ и электронными системами управления.

## Особенности:

- **Двигатель**: 4-цилиндровый объемом *998 см³*
- **Мощность**: 200 л.с. при 13500 об/мин
- **Электронные системы**: Трекшн-контроль, ABS, система стабилизации

### Технологии MotoGP

Мотоцикл оснащен технологиями, разработанными для **гоночной серии MotoGP**:

1. Crossplane крankshaft для плавной подачи мощности
2. Переменные фазы газораспределения
3. Ride-by-wire система управления дросселем

Данный мотоцикл создан для тех, кто не готов идти на компромиссы.
Каждая деталь продумана до мелочей.
Это настоящее произведение инженерного искусства!

> Это не просто мотоцикл, это **произведение инженерного искусства**!

---

*Больше информации на [официальном сайте Yamaha](https://yamaha-motor.com)*',
  ARRAY['https://images.unsplash.com/photo-1558618047-3c8c76c7d315?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop'],
  '{"Объем двигателя": "998 см³", "Мощность": "200 л.с. при 13500 об/мин", "Крутящий момент": "112.4 Нм при 11500 об/мин", "Максимальная скорость": "299 км/ч", "Разгон 0-100 км/ч": "3.0 сек", "Снаряженная масса": "199 кг", "Объем топливного бака": "17 л", "Расход топлива": "6.8 л/100км", "Тип двигателя": "4-тактный, 4-цилиндровый, жидкостное охлаждение", "Система питания": "Электронный впрыск топлива", "Коробка передач": "6-ступенчатая", "Передняя подвеска": "Перевернутая телескопическая вилка KYB 43мм", "Задняя подвеска": "Маятниковая рычажная с моноамортизатором", "Передние тормоза": "Двойные диски 320мм с суппортами Brembo", "Задние тормоза": "Одинарный диск 220мм", "Размер колес спереди": "120/70 ZR17", "Размер колес сзади": "190/55 ZR17", "Длина": "2055 мм", "Ширина": "690 мм", "Высота": "1165 мм", "Колесная база": "1405 мм", "Дорожный просвет": "130 мм", "Высота сиденья": "855 мм", "Электроника": "Трекшн-контроль, ABS, система стабилизации"}',
  'https://disk.yandex.ru/d/example-yamaha-r1-photos',
  NULL,
  1,
  '2024-12-07T10:00:00.000Z',
  NOW()
),
(
  'demo-vmc-250r',
  'VMC 250R Demo с Видео',
  '# VMC 250R Demo

**Демонстрационная модель** для тестирования новой функции видео.
Эта модель показывает как работает встраивание видео на страницу модели.

## Особенности:

- **Двигатель**: 4-тактный одноцилиндровый
- **Объем**: 250 см³
- **Охлаждение**: жидкостное
- **Система питания**: карбюратор

### Новые возможности

Теперь на странице модели можно:

1. Просматривать фотографии
2. **Смотреть видеоролики** прямо на сайте
3. Изучать технические характеристики

> Видео помогает лучше понять особенности модели!

---

*Это демо-модель для тестирования видео функциональности*',
  ARRAY['https://images.unsplash.com/photo-1558618068-fdc5c7dd51de?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop'],
  '{"Объем двигателя": "250 см³", "Мощность": "25 л.с. при 8500 об/мин", "Крутящий момент": "22 Нм при 7000 об/мин", "Максимальная скорость": "140 км/ч", "Снаряженная масса": "140 кг", "Объем топливного бака": "12 л", "Расход топлива": "3.5 л/100км", "Тип двигателя": "4-тактный, одноцилиндровый", "Система питания": "Карбюратор", "Коробка передач": "5-ступенчатая", "Передняя подвеска": "Телескопическая вилка", "Задняя подвеска": "Маятниковая с моноамортизатором", "Передние тормоза": "Дисковый 280мм", "Задние тормоза": "Барабанный 130мм", "Размер колес спереди": "90/90-18", "Размер колес сзади": "110/90-18", "Длина": "2050 мм", "Ширина": "750 мм", "Высота": "1100 мм", "Высота сиденья": "780 мм"}',
  'https://disk.yandex.ru/d/demo-vmc-250r-photos',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
  2,
  '2024-12-07T12:00:00.000Z',
  NOW()
);

-- Проверка данных
SELECT COUNT(*) as total_models FROM vmc_models;
SELECT id, name, "order" FROM vmc_models ORDER BY "order"; 