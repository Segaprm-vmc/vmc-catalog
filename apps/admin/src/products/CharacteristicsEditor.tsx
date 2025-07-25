import { ArrayInput, SimpleFormIterator, TextInput, useRecordContext } from 'react-admin';

// Список всех возможных характеристик VMC
const CHARACTERISTICS = [
  // Заводские данные
  { name: 'manufacturer', label: 'Завод изготовитель' },
  { name: 'engine_manufacturer', label: 'Завод производитель ДВС' },
  
  // Габариты
  { name: 'dimensions_lwh', label: 'Размеры ДхШхВ (мм)' },
  { name: 'seat_height', label: 'Высота сидения (мм)' },
  { name: 'handlebar_height', label: 'Высота по рулю (мм)' },
  { name: 'wheelbase', label: 'Размер по осям (мм)' },
  { name: 'ground_clearance', label: 'Клиренс (мм)' },
  { name: 'weight', label: 'Масса (кг)' },
  { name: 'box_dimensions', label: 'Размеры коробки (мм)' },
  
  // Двигатель
  { name: 'engine_marking', label: 'Маркировка ДВС на крышке' },
  { name: 'engine_actual', label: 'ДВС фактически' },
  { name: 'cooling', label: 'Охлаждение' },
  { name: 'displacement', label: 'Рабочий объем ДВС (сс)' },
  { name: 'bore', label: 'Диаметр поршня (мм)' },
  { name: 'stroke', label: 'Ход поршня (мм)' },
  { name: 'starting', label: 'Запуск' },
  { name: 'kickstarter', label: 'Кикстартер' },
  { name: 'fuel_supply', label: 'Подача топлива' },
  { name: 'diagnostic_port', label: 'Диагностический разъем' },
  { name: 'valves_per_cylinder', label: 'Количество клапанов на цилиндр' },
  
  // Характеристики
  { name: 'max_speed', label: 'МАХ скорость (км/час)' },
  { name: 'transmission', label: 'Трансмиссия' },
  { name: 'gears_count', label: 'Количество передач' },
  { name: 'power', label: 'Мощность ДВС (л.с/кВт/об.мин)' },
  { name: 'fuel_tank_volume', label: 'Объем бака (л)' },
  { name: 'fuel_consumption', label: 'Расход топлива на (л/100 км)' },
  
  // Обслуживание
  { name: 'oil_filter', label: 'Фильтр масляный' },
  { name: 'oil_volume', label: 'Объем масла в ДВС (л)' },
  { name: 'cooling_system', label: 'Система охлаждения' },
  { name: 'coolant', label: 'Охлаждающая жидкость' },
  { name: 'air_filter', label: 'Фильтр воздушный' },
  { name: 'fuel_type', label: 'Топливо' },
  
  // Ходовая
  { name: 'tire_pressure_sensors', label: 'Датчики давления воздуха в шинах' },
  { name: 'front_wheel', label: 'Колесо переднее' },
  { name: 'rear_wheel', label: 'Колесо заднее' },
  { name: 'front_suspension', label: 'Подвеска передняя' },
  { name: 'rear_suspension', label: 'Подвеска задняя' },
  { name: 'front_shocks', label: 'Амортизаторы передние' },
  { name: 'rear_shocks', label: 'Амортизаторы задние' },
  { name: 'front_brake_disc', label: 'Передний тормозной диск' },
  { name: 'front_brake_caliper', label: 'Передний тормозной суппорт' },
  { name: 'rear_brake_disc', label: 'Задний тормозной диск' },
  { name: 'rear_brake_caliper', label: 'Задний тормозной суппорт' },
  { name: 'abs_sensor', label: 'Датчик ABS' },
  { name: 'speed_sensor', label: 'Датчик скорости/привод спидометра' },
  
  // Привод
  { name: 'exhaust', label: 'Глушитель' },
  { name: 'drive_type', label: 'Привод: цепь/ремень' },
  { name: 'front_sprocket', label: 'Звезда ведущая' },
  { name: 'rear_sprocket', label: 'Звезда ведомая' },
  { name: 'battery', label: 'АКБ' },
  
  // Электрика
  { name: 'headlight', label: 'Фара головного света' },
  { name: 'tail_light', label: 'Задний фонарь' },
  { name: 'turn_signals', label: 'Указатели поворотов' },
  { name: 'instrument_panel', label: 'Панель приборов' },
  { name: 'right_switch_block', label: 'Блок переключателей правый' },
  { name: 'left_switch_block', label: 'Блок переключателей левый' },
  
  // Управление
  { name: 'handlebar', label: 'Руль' },
  { name: 'levers', label: 'Рычаги' },
  { name: 'grips', label: 'Ручки' },
  
  // Кузов
  { name: 'seat', label: 'Сидение' },
  { name: 'luggage_rack', label: 'Багажник' },
  { name: 'mirrors', label: 'Зеркала' },
  { name: 'security_system', label: 'Система доступа/сигнализация' },
  
  // Документы
  { name: 'features', label: 'Особенности' },
  { name: 'maintenance_interval', label: 'Интервал прохождения ТО' },
  { name: 'warranty', label: 'Гарантия' },
  { name: 'registration', label: 'Регистрация в ГИБДД' },
  { name: 'pts_certificate', label: 'Наличие ПТС' },
  { name: 'license_required', label: 'Наличие водительского удостоверения' }
];

export const CharacteristicsEditor = () => {
  const record = useRecordContext();
  
  // Создаем массив характеристик с существующими значениями
  const characteristicsWithValues = CHARACTERISTICS.map(char => {
    const existingChar = record?.characteristics?.find((c: any) => c.name === char.name);
    return {
      name: char.name,
      value: existingChar?.value || ''
    };
  });

  return (
    <ArrayInput source="characteristics" label="Характеристики товара" defaultValue={characteristicsWithValues}>
      <SimpleFormIterator>
        <TextInput source="name" label="Название" disabled />
        <TextInput source="value" label="Значение" fullWidth />
      </SimpleFormIterator>
    </ArrayInput>
  );
}; 