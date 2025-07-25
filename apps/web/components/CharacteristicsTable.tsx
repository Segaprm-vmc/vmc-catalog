interface Characteristic {
  name: string
  value: string
}

interface CharacteristicsTableProps {
  characteristics: Characteristic[]
}

const characteristicLabels: Record<string, string> = {
  // Заводские данные
  manufacturer: 'Завод изготовитель',
  engine_manufacturer: 'Завод производитель ДВС',
  
  // Габариты
  dimensions_lwh: 'Размеры ДхШхВ (мм)',
  seat_height: 'Высота сидения (мм)',
  handlebar_height: 'Высота по рулю (мм)',
  wheelbase: 'Размер по осям (мм)',
  ground_clearance: 'Клиренс (мм)',
  weight: 'Масса (кг)',
  box_dimensions: 'Размеры коробки (мм)',
  
  // Двигатель
  engine_marking: 'Маркировка ДВС на крышке',
  engine_actual: 'ДВС фактически',
  cooling: 'Охлаждение',
  displacement: 'Рабочий объем ДВС (сс)',
  bore: 'Диаметр поршня (мм)',
  stroke: 'Ход поршня (мм)',
  starting: 'Запуск',
  kickstarter: 'Кикстартер',
  fuel_supply: 'Подача топлива',
  diagnostic_port: 'Диагностический разъем',
  valves_per_cylinder: 'Количество клапанов на цилиндр',
  
  // Характеристики
  max_speed: 'МАХ скорость (км/час)',
  transmission: 'Трансмиссия',
  gears_count: 'Количество передач',
  power: 'Мощность ДВС (л.с/кВт/об.мин)',
  fuel_tank_volume: 'Объем бака (л)',
  fuel_consumption: 'Расход топлива на (л/100 км)',
  
  // Обслуживание
  oil_filter: 'Фильтр масляный',
  oil_volume: 'Объем масла в ДВС (л)',
  cooling_system: 'Система охлаждения',
  coolant: 'Охлаждающая жидкость',
  air_filter: 'Фильтр воздушный',
  fuel_type: 'Топливо',
  
  // Ходовая
  tire_pressure_sensors: 'Датчики давления воздуха в шинах',
  front_wheel: 'Колесо переднее',
  rear_wheel: 'Колесо заднее',
  front_suspension: 'Подвеска передняя',
  rear_suspension: 'Подвеска задняя',
  front_shocks: 'Амортизаторы передние',
  rear_shocks: 'Амортизаторы задние',
  front_brake_disc: 'Передний тормозной диск',
  front_brake_caliper: 'Передний тормозной суппорт',
  rear_brake_disc: 'Задний тормозной диск',
  rear_brake_caliper: 'Задний тормозной суппорт',
  abs_sensor: 'Датчик ABS',
  speed_sensor: 'Датчик скорости/привод спидометра',
  
  // Привод
  exhaust: 'Глушитель',
  drive_type: 'Привод: цепь/ремень',
  front_sprocket: 'Звезда ведущая',
  rear_sprocket: 'Звезда ведомая',
  battery: 'АКБ',
  
  // Электрика
  headlight: 'Фара головного света',
  tail_light: 'Задний фонарь',
  turn_signals: 'Указатели поворотов',
  instrument_panel: 'Панель приборов',
  right_switch_block: 'Блок переключателей правый',
  left_switch_block: 'Блок переключателей левый',
  
  // Управление
  handlebar: 'Руль',
  levers: 'Рычаги',
  grips: 'Ручки',
  
  // Кузов
  seat: 'Сидение',
  luggage_rack: 'Багажник',
  mirrors: 'Зеркала',
  security_system: 'Система доступа/сигнализация',
  
  // Документы
  features: 'Особенности',
  maintenance_interval: 'Интервал прохождения ТО',
  warranty: 'Гарантия',
  registration: 'Регистрация в ГИБДД',
  pts_certificate: 'Наличие ПТС',
  license_required: 'Наличие водительского удостоверения'
}

export function CharacteristicsTable({ characteristics }: CharacteristicsTableProps) {
  if (!characteristics || characteristics.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Характеристики не указаны</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Характеристика
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Значение
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {characteristics
            .filter(char => char.value && char.value.trim() !== '')
            .map((characteristic, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {characteristicLabels[characteristic.name] || characteristic.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {characteristic.value}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
} 