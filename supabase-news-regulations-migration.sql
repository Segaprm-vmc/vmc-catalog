-- =====================================================
-- VMC Catalog: News and Regulations Migration to Supabase
-- =====================================================

-- Создание таблицы новостей
CREATE TABLE IF NOT EXISTS vmc_news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  image TEXT,
  document JSONB, -- {name, url, type}
  category TEXT DEFAULT 'general',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  publish_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  order_index INTEGER DEFAULT 999
);

-- Создание таблицы регламентов
CREATE TABLE IF NOT EXISTS vmc_regulations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  content TEXT,
  screenshot TEXT,
  download_links JSONB, -- {pdf, word, etc}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  order_index INTEGER DEFAULT 999
);

-- Настройка Row Level Security
ALTER TABLE vmc_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE vmc_regulations ENABLE ROW LEVEL SECURITY;

-- Политики доступа (разрешить всем читать)
CREATE POLICY "Allow all access to vmc_news" ON vmc_news
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to vmc_regulations" ON vmc_regulations
  FOR ALL USING (true) WITH CHECK (true);

-- Включение Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE vmc_news;
ALTER PUBLICATION supabase_realtime ADD TABLE vmc_regulations;

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_vmc_news_category ON vmc_news(category);
CREATE INDEX IF NOT EXISTS idx_vmc_news_published ON vmc_news(published);
CREATE INDEX IF NOT EXISTS idx_vmc_news_featured ON vmc_news(featured);
CREATE INDEX IF NOT EXISTS idx_vmc_news_publish_date ON vmc_news(publish_date);
CREATE INDEX IF NOT EXISTS idx_vmc_news_order ON vmc_news(order_index);

CREATE INDEX IF NOT EXISTS idx_vmc_regulations_category ON vmc_regulations(category);
CREATE INDEX IF NOT EXISTS idx_vmc_regulations_order ON vmc_regulations(order_index);

-- Триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vmc_news_updated_at BEFORE UPDATE ON vmc_news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vmc_regulations_updated_at BEFORE UPDATE ON vmc_regulations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Вставка данных новостей
-- =====================================================

INSERT INTO vmc_news (
  id, title, content, excerpt, image, document, category, featured, published, 
  publish_date, created_at, updated_at, order_index
) VALUES 
(
  'news-1',
  'Новые модели VMC 2024: революция в мире мототехники',
  '## Представляем новую линейку мотоциклов VMC 2024

Компания VMC рада представить революционную линейку мотоциклов 2024 года. Новые модели сочетают в себе передовые технологии, улучшенную эргономику и непревзойденную надежность.

### Основные нововведения:

- **Улучшенная система впрыска топлива** - повышение экономичности на 15%
- **Новая система подвески** - улучшенный комфорт и управляемость
- **Цифровая приборная панель** - современный интерфейс с навигацией
- **Система безопасности ABS** - стандартно на всех моделях

### Доступные модели:

1. **VMC Sport 250** - для любителей скорости
2. **VMC Cruiser 400** - комфорт в дальних поездках
3. **VMC Adventure 500** - покорение бездорожья

Предзаказы уже доступны в наших дилерских центрах!',
  'Компания VMC представляет новую линейку мотоциклов 2024 года с улучшенными характеристиками и передовыми технологиями.',
  '/images/news/new-models-2024.jpg',
  '{"name": "Каталог новых моделей VMC 2024.pdf", "url": "/documents/news/vmc-catalog-2024.pdf", "type": "pdf"}',
  'products',
  true,
  true,
  '2024-01-15T09:00:00.000Z',
  '2024-01-10T14:30:00.000Z',
  '2024-01-15T09:00:00.000Z',
  1
),
(
  'news-2',
  'Открытие нового сервисного центра в Москве',
  '## Расширяем сеть сервисного обслуживания

Мы рады сообщить об открытии нового авторизованного сервисного центра VMC в Москве. Это уже пятый центр в столичном регионе, что позволит нам обеспечить еще более качественное и оперативное обслуживание наших клиентов.

### Услуги нового центра:

- Гарантийное и послегарантийное обслуживание
- Диагностика и ремонт всех систем мотоцикла
- Установка дополнительного оборудования
- Техническое обслуживание по регламенту
- Продажа оригинальных запчастей и аксессуаров

### Адрес и контакты:

**Адрес:** г. Москва, ул. Мотоциклистов, д. 15
**Телефон:** +7 (495) 123-45-67
**Режим работы:** Пн-Пт 9:00-19:00, Сб 10:00-16:00

В честь открытия действует скидка 20% на все виды работ до конца месяца!',
  'Открылся новый авторизованный сервисный центр VMC в Москве. Скидка 20% в честь открытия!',
  '/images/news/new-service-center.jpg',
  null,
  'company',
  false,
  true,
  '2024-01-10T12:00:00.000Z',
  '2024-01-08T16:20:00.000Z',
  '2024-01-10T12:00:00.000Z',
  2
),
(
  'news-3',
  'Участие VMC в выставке MOTO-2024',
  '## VMC на крупнейшей мотовыставке года

Компания VMC примет участие в международной выставке мототехники MOTO-2024, которая пройдет с 15 по 18 февраля в Крокус Экспо.

### Что вас ждет на нашем стенде:

- Презентация новых моделей 2024 года
- Тест-драйв мотоциклов на специальной площадке
- Встреча с инженерами и дизайнерами VMC
- Специальные выставочные цены
- Розыгрыш эксклюзивных призов

### Программа мероприятий:

**15 февраля, 14:00** - Презентация VMC Sport 250
**16 февраля, 15:00** - Мастер-класс по техническому обслуживанию
**17 февраля, 16:00** - Встреча с гонщиками команды VMC Racing
**18 февраля, 13:00** - Розыгрыш главных призов

Приходите к нам на стенд №B15, зал 3. Ждем всех любителей мототехники!',
  'VMC участвует в выставке MOTO-2024. Презентации, тест-драйв и специальные цены 15-18 февраля в Крокус Экспо.',
  '/images/news/moto-exhibition-2024.jpg',
  '{"name": "Программа мероприятий VMC на MOTO-2024.pdf", "url": "/documents/news/moto-2024-program.pdf", "type": "pdf"}',
  'events',
  false,
  true,
  '2024-01-05T10:00:00.000Z',
  '2024-01-03T11:45:00.000Z',
  '2024-01-05T10:00:00.000Z',
  3
),
(
  'news-4',
  'Важные обновления регламента техобслуживания',
  '## Обновленный регламент технического обслуживания

В связи с выпуском новых моделей и накопленным опытом эксплуатации, компания VMC обновила регламент технического обслуживания мотоциклов.

### Основные изменения:

- Увеличены интервалы замены масла для новых двигателей
- Добавлены процедуры обслуживания системы ABS
- Обновлены рекомендации по зимнему хранению
- Введены новые проверки электронных систем

### Что это означает для владельцев:

- **Экономия времени и средств** - меньше визитов в сервис
- **Повышенная надежность** - улучшенные процедуры диагностики
- **Продленный ресурс** - оптимизированное обслуживание

### Переходный период:

Для существующих владельцев мотоциклов действуют особые условия перехода на новый регламент. Подробности уточняйте в авторизованных сервисных центрах.

Новый регламент вступает в силу с 1 февраля 2024 года.',
  'Обновлен регламент технического обслуживания VMC. Увеличены интервалы ТО, добавлены новые процедуры.',
  null,
  '{"name": "Обновленный регламент ТО VMC 2024.pdf", "url": "/documents/news/maintenance-regulations-2024.pdf", "type": "pdf"}',
  'maintenance',
  false,
  true,
  '2024-01-08T14:30:00.000Z',
  '2024-01-06T09:15:00.000Z',
  '2024-01-08T14:30:00.000Z',
  4
);

-- =====================================================
-- Вставка данных регламентов
-- =====================================================

INSERT INTO vmc_regulations (
  id, title, description, category, content, screenshot, download_links, 
  created_at, updated_at, order_index
) VALUES 
(
  'reg-001',
  'Ежедневное техническое обслуживание',
  'Инструкция по ежедневной проверке мототехники перед эксплуатацией',
  'maintenance',
  '## Ежедневная проверка мототехники

### 1. Внешний осмотр
- Проверьте целостность корпуса и отсутствие трещин
- Убедитесь в отсутствии подтеков масла или топлива
- Проверьте крепление всех видимых болтов и гаек

### 2. Система зажигания
- Проверьте заряд аккумулятора
- Убедитесь в чистоте контактов
- Проверьте работу стартера

### 3. Тормозная система
- Проверьте уровень тормозной жидкости
- Убедитесь в отсутствии подтеков
- Проверьте ход тормозных рычагов

### 4. Система охлаждения
- Проверьте уровень охлаждающей жидкости
- Убедитесь в чистоте радиатора
- Проверьте работу вентилятора',
  '/images/regulations/daily-maintenance.jpg',
  '{"pdf": "/documents/daily-maintenance.pdf", "word": "/documents/daily-maintenance.docx"}',
  '2024-01-15T09:00:00Z',
  '2024-01-20T14:30:00Z',
  1
),
(
  'reg-002',
  'Сезонная подготовка к зиме',
  'Регламент подготовки мототехники к зимнему хранению',
  'maintenance',
  '## Подготовка к зимнему хранению

### 1. Топливная система
- Заполните топливный бак до максимума
- Добавьте стабилизатор топлива
- Запустите двигатель на 10-15 минут

### 2. Моторное масло
- Замените моторное масло и фильтр
- Используйте масло рекомендованной вязкости
- Проверьте уровень после замены

### 3. Аккумулятор
- Снимите аккумулятор с техники
- Зарядите до 100%
- Храните в теплом сухом месте
- Подзаряжайте раз в месяц

### 4. Консервация
- Обработайте металлические части защитным составом
- Накройте технику воздухопроницаемым чехлом
- Приподнимите на подставки для разгрузки шин',
  '/images/regulations/winter-preparation.jpg',
  '{"pdf": "/documents/winter-preparation.pdf"}',
  '2024-02-01T10:00:00Z',
  '2024-02-05T16:00:00Z',
  2
),
(
  'reg-003',
  'Правила безопасной эксплуатации',
  'Основные правила безопасности при использовании мототехники',
  'safety',
  '## Правила безопасной эксплуатации

### 1. Защитное снаряжение
- **ОБЯЗАТЕЛЬНО:** Шлем соответствующего стандарта
- **РЕКОМЕНДУЕТСЯ:** Защитная куртка, перчатки, сапоги
- Проверяйте состояние экипировки перед каждой поездкой

### 2. Перед началом движения
- Проверьте работу тормозов
- Убедитесь в исправности световых приборов
- Отрегулируйте зеркала
- Проверьте давление в шинах

### 3. Во время движения
- Соблюдайте скоростной режим
- Держите безопасную дистанцию
- Будьте особенно внимательны на поворотах
- Не превышайте допустимую нагрузку

### 4. Запрещается
- Эксплуатация в состоянии алкогольного опьянения
- Движение без шлема
- Перевозка пассажиров сверх нормы
- Техническое обслуживание на ходу',
  '/images/regulations/safety-rules.jpg',
  '{"pdf": "/documents/safety-rules.pdf", "word": "/documents/safety-rules.docx"}',
  '2024-01-10T08:00:00Z',
  '2024-01-25T12:00:00Z',
  3
),
(
  'reg-004',
  'Регулировка карбюратора',
  'Пошаговая инструкция по настройке карбюратора для оптимальной работы двигателя',
  'technical',
  '## Регулировка карбюратора

### 1. Подготовка
- Прогрейте двигатель до рабочей температуры
- Убедитесь в чистоте воздушного фильтра
- Проверьте герметичность всех соединений

### 2. Регулировка холостого хода
- Заверните винт качества смеси до упора
- Отверните на 1.5-2 оборота
- Запустите двигатель и дайте прогреться
- Винтом количества установите 1200-1500 об/мин

### 3. Настройка главной дозирующей системы
- Снимите крышку карбюратора
- Проверьте уровень топлива в поплавковой камере
- При необходимости отрегулируйте поплавок
- Проверьте состояние жиклеров

### 4. Финальная проверка
- Проведите тест-драйв
- Проверьте отзывчивость на газ
- Убедитесь в отсутствии провалов при ускорении
- При необходимости повторите регулировку',
  '/images/regulations/carburetor-adjustment.jpg',
  '{"pdf": "/documents/carburetor-adjustment.pdf"}',
  '2024-01-20T14:00:00Z',
  '2024-01-20T14:00:00Z',
  4
),
(
  'reg-005',
  'Гарантийное обслуживание',
  'Условия и порядок гарантийного обслуживания мототехники VMC',
  'warranty',
  '## Условия гарантии

### 1. Гарантийный период
- **Двигатель:** 24 месяца или 5000 км пробега
- **Электрооборудование:** 12 месяцев
- **Кузовные детали:** 12 месяцев
- **Расходные материалы:** согласно регламенту ТО

### 2. Гарантийные обязательства
- Бесплатное устранение заводских дефектов
- Замена дефектных деталей на новые
- Компенсация стоимости ремонта у официальных дилеров

### 3. Условия сохранения гарантии
- Прохождение ТО у официальных дилеров
- Использование оригинальных запчастей
- Соблюдение правил эксплуатации
- Сохранение документов о покупке и обслуживании

### 4. Случаи прекращения гарантии
- Самостоятельный ремонт или ремонт у неофициальных сервисов
- Использование неоригинальных запчастей
- Механические повреждения по вине владельца
- Нарушение правил эксплуатации

### 5. Порядок предъявления претензий
- Обращение к официальному дилеру
- Предоставление документов о покупке
- Диагностика неисправности
- Оформление гарантийного случая',
  null,
  '{"pdf": "/documents/warranty-terms.pdf", "word": "/documents/warranty-terms.docx"}',
  '2024-01-05T10:00:00Z',
  '2024-02-01T09:00:00Z',
  5
),
(
  'reg-006',
  'Замена моторного масла',
  'Подробная инструкция по замене моторного масла и масляного фильтра',
  'maintenance',
  '## Замена моторного масла

### 1. Необходимые инструменты
- Ключ для сливной пробки
- Съемник масляного фильтра
- Воронка для заливки масла
- Емкость для отработанного масла (не менее 4 литров)
- Новое моторное масло (согласно спецификации)
- Новый масляный фильтр
- Новая прокладка сливной пробки

### 2. Подготовка
- Прогрейте двигатель до рабочей температуры
- Установите мототехнику на ровную поверхность
- Заглушите двигатель и дайте остыть 10-15 минут
- Подготовьте инструменты и материалы

### 3. Слив старого масла
- Найдите сливную пробку в нижней части картера
- Подставьте емкость для отработанного масла
- Осторожно выверните сливную пробку
- Дайте маслу полностью стечь (15-20 минут)

### 4. Замена масляного фильтра
- Найдите масляный фильтр
- Снимите старый фильтр съемником
- Очистите посадочное место
- Смажьте уплотнительное кольцо нового фильтра
- Установите новый фильтр от руки плюс 3/4 оборота

### 5. Заливка нового масла
- Закрутите сливную пробку с новой прокладкой
- Снимите крышку маслозаливной горловины
- Через воронку залейте новое масло
- Количество согласно инструкции (обычно 3-4 литра)
- Проверьте уровень щупом через 5 минут

### 6. Проверка
- Запустите двигатель на 2-3 минуты
- Заглушите и подождите 5 минут
- Проверьте уровень масла щупом
- Долейте при необходимости
- Проверьте отсутствие подтеков',
  '/images/regulations/oil-change.jpg',
  '{"pdf": "/documents/oil-change.pdf"}',
  '2024-01-12T11:00:00Z',
  '2024-01-12T11:00:00Z',
  6
),
(
  'reg-007',
  'Диагностика электрооборудования',
  'Методика диагностики и поиска неисправностей в электросистеме',
  'technical',
  '## Диагностика электрооборудования

### 1. Необходимые инструменты
- Мультиметр
- Набор предохранителей
- Изоляционная лента
- Щетка для очистки контактов
- Схема электрооборудования

### 2. Проверка аккумулятора
- Измерьте напряжение на клеммах (норма 12.6-12.8 В)
- Проверьте плотность электролита (1.27-1.29 г/см³)
- Очистите клеммы от окислов
- Проверьте надежность крепления

### 3. Проверка генератора
- Запустите двигатель
- Измерьте напряжение на клеммах аккумулятора
- На холостом ходу: 13.8-14.4 В
- При повышенных оборотах: не более 14.8 В
- Проверьте натяжение ремня генератора

### 4. Диагностика стартера
- Проверьте напряжение на клемме стартера при пуске
- Измерьте сопротивление обмоток
- Проверьте состояние щеток и коллектора
- Убедитесь в легкости вращения

### 5. Проверка освещения
- Проверьте все лампы и светодиоды
- Измерьте напряжение на разъемах
- Проверьте состояние предохранителей
- Убедитесь в надежности контактов

### 6. Система зажигания
- Проверьте зазор в свечах зажигания
- Измерьте сопротивление катушки зажигания
- Проверьте целостность высоковольтных проводов
- Убедитесь в правильности установки момента зажигания',
  '/images/regulations/electrical-diagnostics.jpg',
  '{"pdf": "/documents/electrical-diagnostics.pdf", "word": "/documents/electrical-diagnostics.docx"}',
  '2024-01-18T13:00:00Z',
  '2024-01-22T10:30:00Z',
  7
),
(
  'reg-008',
  'Настройка подвески',
  'Регулировка передней и задней подвески для оптимального комфорта и управляемости',
  'technical',
  '## Настройка подвески

### 1. Инструменты и подготовка
- Динамометрический ключ
- Набор шестигранников
- Линейка или штангенциркуль
- Манометр для измерения давления
- Весы для определения веса водителя

### 2. Передняя подвеска
**Регулировка предварительной нагрузки пружин:**
- Вес водителя до 70 кг: положение 1-2
- Вес водителя 70-85 кг: положение 3-4
- Вес водителя свыше 85 кг: положение 5-6

**Настройка демпфирования:**
- Сжатие: начните с положения посередине
- Отбой: также установите среднее значение
- Корректируйте по ощущениям после тест-драйва

### 3. Задняя подвеска
**Моноамортизатор:**
- Предварительная нагрузка пружины по весу
- Регулировка демпфирования сжатия
- Регулировка демпфирования отбоя
- Настройка под стиль езды

### 4. Рекомендации по настройке
**Для комфортной езды:**
- Мягкая настройка сжатия
- Умеренная настройка отбоя
- Минимальная предварительная нагрузка

**Для спортивной езды:**
- Жесткая настройка сжатия
- Быстрый отбой
- Увеличенная предварительная нагрузка

### 5. Проверка и тестирование
- Проведите тест-драйв на различных покрытиях
- Оцените комфорт и управляемость
- При необходимости внесите корректировки
- Зафиксируйте финальные настройки',
  null,
  '{"pdf": "/documents/suspension-setup.pdf"}',
  '2024-01-25T15:00:00Z',
  '2024-01-25T15:00:00Z',
  8
);

-- =====================================================
-- Проверка результатов
-- =====================================================

-- Проверяем количество записей
SELECT 'News count:' as table_name, COUNT(*) as count FROM vmc_news
UNION ALL
SELECT 'Regulations count:' as table_name, COUNT(*) as count FROM vmc_regulations;

-- Проверяем структуру данных
SELECT 'News sample:' as info, id, title, category, featured FROM vmc_news LIMIT 3;
SELECT 'Regulations sample:' as info, id, title, category FROM vmc_regulations LIMIT 3;

COMMIT; 