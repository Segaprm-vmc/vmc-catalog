import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...');

  // 1. Создание админ пользователя
  const hashedPassword = await bcrypt.hash('admin123!', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'marketing@benzo.ru' },
    update: {},
    create: {
      email: 'marketing@benzo.ru',
      password: hashedPassword,
      name: 'VMC Marketing Admin',
      role: 'admin'
    }
  });

  console.log('✅ Админ пользователь создан:', admin.email);

  // 2. Создание категорий
  const categories = [
    {
      name: 'Скутера',
      slug: 'scooters',
      description: 'Городские и спортивные скутера для ежедневного использования',
      order: 1
    },
    {
      name: 'Мопеды',
      slug: 'mopeds',
      description: 'Легкие мопеды для новичков и городских поездок',
      order: 2
    },
    {
      name: 'Мотоциклы',
      slug: 'motorcycles',
      description: 'Спортивные и туристические мотоциклы',
      order: 3
    },
    {
      name: 'Питбайки',
      slug: 'pitbikes',
      description: 'Питбайки для бездорожья и спортивных соревнований',
      order: 4
    }
  ];

  const createdCategories = {};
  
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
    createdCategories[category.slug] = created;
    console.log(`✅ Категория создана: ${created.name}`);
  }

  // 3. Создание товаров
  const products = [
    // СКУТЕРА (23 товара)
    {
      name: 'VMC INFERNO NEW BY49QT-5A',
      slug: 'vmc-inferno-new-by49qt-5a',
      description: 'Скутер 49 см³ СЕРИЯ N1700 с дисковыми тормозами (передний/задний)',
      categorySlug: 'scooters',
      order: 1,
      displacement: '49',
      series: 'N1700',
      features: 'Дисковые тормоза (пер/зад), VIN'
    },
    {
      name: 'VMC CORSA RS BY49QT-2A',
      slug: 'vmc-corsa-rs-by49qt-2a',
      description: 'Скутер 49 см³ СЕРИЯ N1500',
      categorySlug: 'scooters',
      order: 2,
      displacement: '49',
      series: 'N1500',
      features: 'VIN'
    },
    {
      name: 'VMC SPRINT BY49QT-2A',
      slug: 'vmc-sprint-by49qt-2a',
      description: 'Скутер 49 см³ СЕРИЯ A1250 с инжектором и воздушным охлаждением',
      categorySlug: 'scooters',
      order: 3,
      displacement: '49',
      series: 'A1250',
      features: 'Инжектор, воздушное охлаждение'
    },
    {
      name: 'VMC RETRO BY49QT-2A',
      slug: 'vmc-retro-by49qt-2a',
      description: 'Скутер 49 см³ СЕРИЯ N1500 с сигнализацией',
      categorySlug: 'scooters',
      order: 4,
      displacement: '49',
      series: 'N1500',
      features: 'Сигнализация, VIN'
    },
    {
      name: 'VMC SMART-II BY49QT-5A',
      slug: 'vmc-smart-ii-by49qt-5a',
      description: 'Скутер 49 см³ СЕРИЯ N1500 с сигнализацией',
      categorySlug: 'scooters',
      order: 5,
      displacement: '49',
      series: 'N1500',
      features: 'Сигнализация, VIN'
    },
    {
      name: 'VMC CYCLONE BY49QT-5A',
      slug: 'vmc-cyclone-by49qt-5a',
      description: 'Скутер 49 см³ СЕРИЯ T1700 с LED панелью, CBS и USB',
      categorySlug: 'scooters',
      order: 6,
      displacement: '49',
      series: 'T1700',
      features: 'LED панель, CBS, USB'
    },
    {
      name: 'VMC NAKED BY49QT-5A',
      slug: 'vmc-naked-by49qt-5a',
      description: 'Скутер 49 см³ СЕРИЯ N1500 с сигнализацией',
      categorySlug: 'scooters',
      order: 7,
      displacement: '49',
      series: 'N1500',
      features: 'Сигнализация, VIN'
    },
    {
      name: 'VMC FORCE BY49QT-2A',
      slug: 'vmc-force-by49qt-2a',
      description: 'Скутер 49 см³ СЕРИЯ A1250 с инжектором и воздушным охлаждением',
      categorySlug: 'scooters',
      order: 8,
      displacement: '49',
      series: 'A1250',
      features: 'Инжектор, воздушное охлаждение'
    },
    {
      name: 'VMC CITY BY49QT-2A',
      slug: 'vmc-city-by49qt-2a',
      description: 'Скутер 49 см³ СЕРИЯ N1500 с LED фарами и сигнализацией',
      categorySlug: 'scooters',
      order: 9,
      displacement: '49',
      series: 'N1500',
      features: 'LED фары, сигнализация, VIN'
    },
    {
      name: 'VMC SMART-III BY49QT-5A',
      slug: 'vmc-smart-iii-by49qt-5a',
      description: 'Скутер 49 см³ СЕРИЯ T1700',
      categorySlug: 'scooters',
      order: 10,
      displacement: '49',
      series: 'T1700',
      features: 'VIN'
    },
    {
      name: 'VMC INFERNO BY49QT-5A',
      slug: 'vmc-inferno-by49qt-5a',
      description: 'Скутер 49 см³ СЕРИЯ Т1700',
      categorySlug: 'scooters',
      order: 11,
      displacement: '49',
      series: 'T1700',
      features: 'VIN'
    },
    {
      name: 'VMC SMART X BY49QT-5A',
      slug: 'vmc-smart-x-by49qt-5a',
      description: 'Скутер 49 см³ СЕРИЯ T1700 с LED панелью, CBS, USB и сигнализацией',
      categorySlug: 'scooters',
      order: 12,
      displacement: '49',
      series: 'T1700',
      features: 'LED панель, CBS, USB, сигнализация'
    },
    {
      name: 'VMC JET BY150T-5A',
      slug: 'vmc-jet-by150t-5a',
      description: 'Скутер 149см³ СЕРИЯ N1800 с инжектором и воздушным охлаждением',
      categorySlug: 'scooters',
      order: 13,
      displacement: '149',
      series: 'N1800',
      features: 'Инжектор, воздушное охлаждение, ЭПТС'
    },
    {
      name: 'VMC PCX BY170T-3A',
      slug: 'vmc-pcx-by170t-3a',
      description: 'Скутер 169 см³ СЕРИЯ Т1700',
      categorySlug: 'scooters',
      order: 14,
      displacement: '169',
      series: 'T1700',
      features: 'ЭПТС'
    },
    {
      name: 'VMC MAX RS BY150T-5A',
      slug: 'vmc-max-rs-by150t-5a',
      description: 'Скутер 149см³ СЕРИЯ N1500 с инжектором, жидкостным охлаждением и ABS',
      categorySlug: 'scooters',
      order: 15,
      displacement: '149',
      series: 'N1500',
      features: 'Инжектор, жидкостное охлаждение, дисковые тормоза ABS, ЭПТС'
    },
    {
      name: 'VMC XMAX BY150T-5A',
      slug: 'vmc-xmax-by150t-5a',
      description: 'Скутер 149cc СЕРИЯ T2500',
      categorySlug: 'scooters',
      order: 16,
      displacement: '149',
      series: 'T2500',
      features: 'ЭПТС'
    },
    {
      name: 'VMC Z1 TY300T-2E',
      slug: 'vmc-z1-ty300t-2e',
      description: 'Скутер 276 см³ СЕРИЯ Т3000',
      categorySlug: 'scooters',
      order: 17,
      displacement: '276',
      series: 'T3000',
      features: 'ЭПТС'
    },
    {
      name: 'VMC JET ADV BY150T-5A',
      slug: 'vmc-jet-adv-by150t-5a',
      description: 'Скутер 149см³ СЕРИЯ А1500',
      categorySlug: 'scooters',
      order: 18,
      displacement: '149',
      series: 'A1500',
      features: 'ЭПТС, VIN'
    },
    {
      name: 'VMC JET RS BY150T-5A',
      slug: 'vmc-jet-rs-by150t-5a',
      description: 'Скутер 149см³ СЕРИЯ S1800 с инжектором, воздушным охлаждением и COMBI BRAKE',
      categorySlug: 'scooters',
      order: 19,
      displacement: '149',
      series: 'S1800',
      features: 'Инжектор, воздушное охлаждение, COMBI BRAKE, ЭПТС'
    },
    {
      name: 'VMC MAX RS BY150T-5A (S1800)',
      slug: 'vmc-max-rs-by150t-5a-s1800',
      description: 'Скутер 149см³ СЕРИЯ S1800 с инжектором, воздушным охлаждением и Combi BS',
      categorySlug: 'scooters',
      order: 20,
      displacement: '149',
      series: 'S1800',
      features: 'Инжектор, воздушное охлаждение, Combi BS, бесключевой доступ, ЭПТС'
    },
    {
      name: 'VMC PCX BY170T-3A (N1700)',
      slug: 'vmc-pcx-by170t-3a-n1700',
      description: 'Скутер 169 см³ СЕРИЯ N1700',
      categorySlug: 'scooters',
      order: 21,
      displacement: '169',
      series: 'N1700',
      features: 'ЭПТС'
    },
    {
      name: 'VMC T-15 TY300T-2E',
      slug: 'vmc-t-15-ty300t-2e',
      description: 'Скутер 276cc СЕРИЯ TR3000 с инжектором, водяным охлаждением и ABS',
      categorySlug: 'scooters',
      order: 22,
      displacement: '276',
      series: 'TR3000',
      features: 'Инжектор, водяное охлаждение, ABS'
    },
    {
      name: 'VMC T-16 TY300T-2E',
      slug: 'vmc-t-16-ty300t-2e',
      description: 'Скутер 276cc СЕРИЯ TR3000 с инжектором, водяным охлаждением и ABS',
      categorySlug: 'scooters',
      order: 23,
      displacement: '276',
      series: 'TR3000',
      features: 'Инжектор, водяное охлаждение, ABS'
    },

    // МОПЕДЫ (5 товаров)
    {
      name: 'VMC NOVA CM48Q',
      slug: 'vmc-nova-cm48q',
      description: 'Мопед 48 см³ СЕРИЯ R1100 с LED фарой, фонарем и панелью приборов',
      categorySlug: 'mopeds',
      order: 1,
      displacement: '48',
      series: 'R1100',
      features: 'LED фара/фонарь/панель приборов, VIN'
    },
    {
      name: 'VMC NOVA RS CM48Q',
      slug: 'vmc-nova-rs-cm48q',
      description: 'Мопед 48 см³ СЕРИЯ R1250 с балансирным валом и LED освещением',
      categorySlug: 'mopeds',
      order: 2,
      displacement: '48',
      series: 'R1250',
      features: 'Балансирный вал, LED фара/фонарь/панель приборов, VIN'
    },
    {
      name: 'VMC AURA RS CM48Q',
      slug: 'vmc-aura-rs-cm48q',
      description: 'Мопед 48 см³ СЕРИЯ R1250 с балансирным валом и LED освещением',
      categorySlug: 'mopeds',
      order: 3,
      displacement: '48',
      series: 'R1250',
      features: 'Балансирный вал, LED фара/фонарь/панель приборов, VIN'
    },
    {
      name: 'VMC Monster Plus CM48Q',
      slug: 'vmc-monster-plus-cm48q',
      description: 'Мопед 48 см³ СЕРИЯ Y1250 с двигателем и LED линзованной фарой',
      categorySlug: 'mopeds',
      order: 4,
      displacement: '48',
      series: 'Y1250',
      features: 'LED линзованная фара, VIN'
    },
    {
      name: 'VMC AURA CM48Q',
      slug: 'vmc-aura-cm48q',
      description: 'Мопед 48см³ СЕРИЯ R1100 с LED освещением и дисковым тормозом',
      categorySlug: 'mopeds',
      order: 5,
      displacement: '48',
      series: 'R1100',
      features: 'LED фара/фонарь/панель приборов, передний дисковый тормоз, VIN'
    },

    // МОТОЦИКЛЫ (6 товаров)
    {
      name: 'VMC Monster Plus BY200-2A',
      slug: 'vmc-monster-plus-by200-2a',
      description: 'Мотоцикл 197см³ СЕРИЯ Y2500',
      categorySlug: 'motorcycles',
      order: 1,
      displacement: '197',
      series: 'Y2500',
      features: 'ЭПТС'
    },
    {
      name: 'VMC VERSO СROSS BY200-2A',
      slug: 'vmc-verso-cross-by200-2a',
      description: 'Мотоцикл 197см³ СЕРИЯ RX2000',
      categorySlug: 'motorcycles',
      order: 2,
      displacement: '197',
      series: 'RX2000',
      features: 'ЭПТС'
    },
    {
      name: 'VMC VERSO BY200-2A',
      slug: 'vmc-verso-by200-2a',
      description: 'Мотоцикл 197см³ СЕРИЯ N2000 с литыми дисками',
      categorySlug: 'motorcycles',
      order: 3,
      displacement: '197',
      series: 'N2000',
      features: 'Литые диски, ЭПТС'
    },
    {
      name: 'VMC ENDURO BY250GY-A CG250 (RX2500)',
      slug: 'vmc-enduro-by250gy-a-cg250-rx2500',
      description: 'Мотоцикл 250cм³ СЕРИЯ RX2500',
      categorySlug: 'motorcycles',
      order: 4,
      displacement: '250',
      series: 'RX2500',
      features: 'ЭПТС'
    },
    {
      name: 'VMC ENDURO BY250GY-A CG250 (RX3000)',
      slug: 'vmc-enduro-by250gy-a-cg250-rx3000',
      description: 'Мотоцикл 250см³ СЕРИЯ RX3000',
      categorySlug: 'motorcycles',
      order: 5,
      displacement: '250',
      series: 'RX3000',
      features: 'ЭПТС'
    },
    {
      name: 'VMC CRUISER TY400-5E',
      slug: 'vmc-cruiser-ty400-5e',
      description: 'Мотоцикл 407см³ СЕРИЯ T4000',
      categorySlug: 'motorcycles',
      order: 6,
      displacement: '407',
      series: 'T4000',
      features: ''
    },

    // ПИТБАЙКИ (5 товаров)
    {
      name: 'KXD 17/14 49см³',
      slug: 'kxd-17-14-49cm3',
      description: 'Питбайк 49см³ СЕРИЯ 1250 КОМПЛ.1 с 4МКПП, кик/эл.стартером',
      categorySlug: 'pitbikes',
      order: 1,
      displacement: '49',
      series: '1250',
      features: '4МКПП, кик/эл.стартер, фара/стоп сигнал, БЕЗ поворотов/зеркал, VIN'
    },
    {
      name: 'VMC 17/14 125см³ (без эл.стартера)',
      slug: 'vmc-17-14-125cm3-bez-el-startera',
      description: 'Питбайк 125см³ без электростартера для спортивных соревнований',
      categorySlug: 'pitbikes',
      order: 2,
      displacement: '125',
      series: '',
      features: 'Без электростартера, для спортивных соревнований, VIN'
    },
    {
      name: 'VMC 10/10 двиг. 2T',
      slug: 'vmc-10-10-dvig-2t',
      description: 'Питбайк с двухтактным двигателем для спортивных соревнований',
      categorySlug: 'pitbikes',
      order: 3,
      displacement: '',
      series: '',
      features: '2Т двигатель, для спортивных соревнований, VIN'
    },
    {
      name: 'VMC 17/14 125см³ (эл.стартер)',
      slug: 'vmc-17-14-125cm3-el-starter',
      description: 'Питбайк 125см³ с электростартером для спортивных соревнований',
      categorySlug: 'pitbikes',
      order: 4,
      displacement: '125',
      series: '',
      features: 'Электростартер, для спортивных соревнований, VIN'
    },
    {
      name: 'VMC 19/16 140см³',
      slug: 'vmc-19-16-140cm3',
      description: 'Питбайк 140см³ с электростартером и масляным радиатором для спорта',
      categorySlug: 'pitbikes',
      order: 5,
      displacement: '140',
      series: '',
      features: 'Электростартер, масляный радиатор, для спортивных соревнований, VIN'
    }
  ];

  // Создание товаров
  for (const product of products) {
    const category = createdCategories[product.categorySlug];
    
    if (!category) {
      console.log(`❌ Категория не найдена: ${product.categorySlug}`);
      continue;
    }

    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        order: product.order,
        isActive: true
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        categoryId: category.id,
        order: product.order,
        isActive: true,
        images: [
          `https://via.placeholder.com/800x450/CCCCCC/666666?text=VMC+${product.slug.toUpperCase().replace(/-/g, '+')}+1`,
          `https://via.placeholder.com/800x450/CCCCCC/666666?text=VMC+${product.slug.toUpperCase().replace(/-/g, '+')}+2`,
          `https://via.placeholder.com/800x450/CCCCCC/666666?text=VMC+${product.slug.toUpperCase().replace(/-/g, '+')}+3`,
          `https://via.placeholder.com/800x450/CCCCCC/666666?text=VMC+${product.slug.toUpperCase().replace(/-/g, '+')}+4`,
          `https://via.placeholder.com/800x450/CCCCCC/666666?text=VMC+${product.slug.toUpperCase().replace(/-/g, '+')}+5`
        ],
        videoUrls: []
      }
    });

    // Создание базовых характеристик для каждого товара
    const characteristics = [
      { name: 'manufacturer', value: 'VMC' },
      { name: 'engine_manufacturer', value: 'VMC' },
      { name: 'displacement', value: product.displacement || '' },
      { name: 'features', value: product.features || '' }
    ];

    if (product.series) {
      characteristics.push({ name: 'series', value: product.series });
    }

    // Дополнительные характеристики в зависимости от категории
    if (product.categorySlug === 'scooters') {
      characteristics.push(
        { name: 'fuel_type', value: 'АИ-92' },
        { name: 'transmission', value: 'Вариатор' },
        { name: 'starting', value: 'Электрический/Кикстартер' }
      );
    } else if (product.categorySlug === 'mopeds') {
      characteristics.push(
        { name: 'fuel_type', value: 'АИ-92' },
        { name: 'transmission', value: 'Вариатор' },
        { name: 'license_required', value: 'Не требуется' }
      );
    } else if (product.categorySlug === 'motorcycles') {
      characteristics.push(
        { name: 'fuel_type', value: 'АИ-92' },
        { name: 'transmission', value: 'Механическая' },
        { name: 'license_required', value: 'Категория А' }
      );
    } else if (product.categorySlug === 'pitbikes') {
      characteristics.push(
        { name: 'fuel_type', value: 'АИ-92' },
        { name: 'transmission', value: 'Механическая' },
        { name: 'features', value: 'Для спортивных соревнований' }
      );
    }

    // Создание характеристик
    for (const char of characteristics) {
      if (char.value) {
        await prisma.productCharacteristic.upsert({
          where: {
            productId_name: {
              productId: createdProduct.id,
              name: char.name
            }
          },
          update: {
            value: char.value
          },
          create: {
            productId: createdProduct.id,
            name: char.name,
            value: char.value
          }
        });
      }
    }

    console.log(`✅ Товар создан: ${createdProduct.name} (${category.name})`);
  }

  // Статистика
  const totalProducts = await prisma.product.count();
  const totalCategories = await prisma.category.count();
  
  console.log('\n🎉 Заполнение базы данных завершено!');
  console.log(`📊 Статистика:`);
  console.log(`   • Категорий: ${totalCategories}`);
  console.log(`   • Товаров: ${totalProducts}`);
  console.log(`   • Скутеров: 23`);
  console.log(`   • Мопедов: 5`);
  console.log(`   • Мотоциклов: 6`);
  console.log(`   • Питбайков: 5`);
  console.log(`\n🔑 Админ доступ:`);
  console.log(`   Email: marketing@benzo.ru`);
  console.log(`   Password: admin123!`);
  console.log(`\n🌐 Разработка: http://localhost:3001/admin`);
  console.log(`🌐 Продакшен: https://edu.vmcmoto.ru/admin`);
  console.log(`\n🏍️ Приложение готово к запуску!`);
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
