interface Product {
  id: number
  name: string
  slug: string
  description: string
  images: string[]
  category: {
    name: string
    slug: string
  }
  characteristics: Array<{
    name: string
    value: string
  }>
}

interface ComparisonTableProps {
  products: Product[]
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

export function ComparisonTable({ products }: ComparisonTableProps) {
  if (products.length < 2) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Для сравнения необходимо выбрать минимум 2 товара</p>
      </div>
    )
  }

  // Получаем все уникальные характеристики
  const allCharacteristics = new Set<string>()
  products.forEach(product => {
    product.characteristics.forEach(char => {
      allCharacteristics.add(char.name)
    })
  })

  const sortedCharacteristics = Array.from(allCharacteristics).sort()

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
              Характеристика
            </th>
            {products.map((product) => (
              <th key={product.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-gray-900">{product.name}</span>
                  <span className="text-xs text-red-600">{product.category.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedCharacteristics.map((charName) => {
            const values = products.map(product => {
              const char = product.characteristics.find(c => c.name === charName)
              return char?.value || '-'
            })

            // Проверяем, есть ли различия в значениях
            const uniqueValues = new Set(values.filter(v => v !== '-'))
            const hasDifferences = uniqueValues.size > 1

            return (
              <tr key={charName} className={hasDifferences ? 'bg-yellow-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                  {characteristicLabels[charName] || charName}
                </td>
                {values.map((value, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {value}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Легенда */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Обозначения:</h4>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-50 border border-yellow-200"></div>
            <span>Различия в характеристиках</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border border-gray-200"></div>
            <span>Одинаковые значения</span>
          </div>
        </div>
      </div>
    </div>
  )
} 