import type { ProductInput } from "@shop-monorepo/types";
import type { Brand, Category } from "@shop-monorepo/types";

interface ProductSeedData {
  name: string;
  description: string;
  image: string;
  price: number;
  oldPrice?: number;
  brandName: string;
  categoryNames: string[];
  isNew?: boolean;
}

const productsSeedData: ProductSeedData[] = [
  // Макіяж - помади та губи
  {
    name: "Matte Lipstick Ruby Woo",
    description: "Культова матова помада насиченого червоного кольору з довготривалою формулою",
    image: "https://picsum.photos/seed/lipstick1/400/400",
    price: 850,
    brandName: "MAC Cosmetics",
    categoryNames: ["Макіяж"],
    isNew: false,
  },
  {
    name: "SuperStay Matte Ink",
    description: "Рідка матова помада з ефектом татуажу, тримається до 16 годин",
    image: "https://picsum.photos/seed/lipstick2/400/400",
    price: 420,
    oldPrice: 520,
    brandName: "Maybelline",
    categoryNames: ["Макіяж"],
    isNew: true,
  },
  {
    name: "Soft Matte Lip Cream",
    description: "Кремова матова помада з легкою текстурою та яскравими пігментами",
    image: "https://picsum.photos/seed/lipstick3/400/400",
    price: 380,
    brandName: "NYX Professional Makeup",
    categoryNames: ["Макіяж"],
    isNew: false,
  },
  // Макіяж - тональні засоби
  {
    name: "Fit Me Matte + Poreless Foundation",
    description: "Легка тональна основа для матової шкіри без пор, підходить для жирної шкіри",
    image: "https://picsum.photos/seed/foundation1/400/400",
    price: 340,
    brandName: "Maybelline",
    categoryNames: ["Макіяж"],
    isNew: false,
  },
  {
    name: "True Match Foundation",
    description: "Тональний крем з технологією підбору ідеального відтінку для вашої шкіри",
    image: "https://picsum.photos/seed/foundation2/400/400",
    price: 450,
    oldPrice: 550,
    brandName: "L'Oréal Paris",
    categoryNames: ["Макіяж"],
    isNew: false,
  },
  {
    name: "Studio Fix Fluid SPF 15",
    description: "Професійна тональна основа з матовим фінішем та захистом від сонця",
    image: "https://picsum.photos/seed/foundation3/400/400",
    price: 1250,
    brandName: "MAC Cosmetics",
    categoryNames: ["Макіяж"],
    isNew: true,
  },
  // Макіяж - туші та очі
  {
    name: "Lash Sensational Sky High Mascara",
    description: "Туш для вій з ефектом накладних вій, подовжує та додає об'єм",
    image: "https://picsum.photos/seed/mascara1/400/400",
    price: 390,
    brandName: "Maybelline",
    categoryNames: ["Макіяж"],
    isNew: true,
  },
  {
    name: "Volumissime Royale Mascara",
    description: "Туш для екстремального об'єму з насиченим чорним пігментом",
    image: "https://picsum.photos/seed/mascara2/400/400",
    price: 420,
    oldPrice: 490,
    brandName: "L'Oréal Paris",
    categoryNames: ["Макіяж"],
    isNew: false,
  },
  // Догляд за шкірою - сироватки
  {
    name: "Niacinamide 10% + Zinc 1%",
    description: "Сироватка для звуження пор та контролю жирності шкіри",
    image: "https://picsum.photos/seed/serum1/400/400",
    price: 280,
    brandName: "The Ordinary",
    categoryNames: ["Догляд за шкірою"],
    isNew: false,
  },
  {
    name: "Hyaluronic Acid 2% + B5",
    description: "Зволожуюча сироватка з гіалуроновою кислотою для глибокого зволоження",
    image: "https://picsum.photos/seed/serum2/400/400",
    price: 260,
    brandName: "The Ordinary",
    categoryNames: ["Догляд за шкірою"],
    isNew: false,
  },
  {
    name: "Retinol 0.5% in Squalane",
    description: "Антивікова сироватка з ретинолом для вирівнювання тону шкіри",
    image: "https://picsum.photos/seed/serum3/400/400",
    price: 320,
    oldPrice: 380,
    brandName: "The Ordinary",
    categoryNames: ["Догляд за шкірою"],
    isNew: true,
  },
  // Догляд за шкірою - очищення
  {
    name: "Hydrating Facial Cleanser",
    description: "М'який очищуючий засіб з церамідами та гіалуроновою кислотою",
    image: "https://picsum.photos/seed/cleanser1/400/400",
    price: 450,
    brandName: "CeraVe",
    categoryNames: ["Догляд за шкірою"],
    isNew: false,
  },
  {
    name: "Foaming Facial Cleanser",
    description: "Пінка для вмивання для нормальної та жирної шкіри з ніацинамідом",
    image: "https://picsum.photos/seed/cleanser2/400/400",
    price: 480,
    brandName: "CeraVe",
    categoryNames: ["Догляд за шкірою"],
    isNew: false,
  },
  // Догляд за шкірою - креми
  {
    name: "Moisturizing Cream",
    description: "Насичений зволожуючий крем з церамідами для сухої шкіри",
    image: "https://picsum.photos/seed/cream1/400/400",
    price: 520,
    oldPrice: 620,
    brandName: "CeraVe",
    categoryNames: ["Догляд за шкірою"],
    isNew: false,
  },
  {
    name: "Natural Moisturizing Factors + HA",
    description: "Легкий зволожуючий крем з натуральними факторами зволоження",
    image: "https://picsum.photos/seed/cream2/400/400",
    price: 290,
    brandName: "The Ordinary",
    categoryNames: ["Догляд за шкірою"],
    isNew: true,
  },
  {
    name: "Soft Moisturizing Cream",
    description: "Універсальний зволожуючий крем для всієї родини",
    image: "https://picsum.photos/seed/cream3/400/400",
    price: 180,
    brandName: "Nivea",
    categoryNames: ["Догляд за шкірою"],
    isNew: false,
  },
  // Догляд за волоссям
  {
    name: "Elvive Total Repair 5 Shampoo",
    description: "Відновлюючий шампунь для пошкодженого волосся з керамідами",
    image: "https://picsum.photos/seed/shampoo1/400/400",
    price: 220,
    brandName: "L'Oréal Paris",
    categoryNames: ["Догляд за волоссям"],
    isNew: false,
  },
  {
    name: "Elvive Hyaluron Moisture Shampoo",
    description: "Зволожуючий шампунь з гіалуроновою кислотою для сухого волосся",
    image: "https://picsum.photos/seed/shampoo2/400/400",
    price: 240,
    oldPrice: 290,
    brandName: "L'Oréal Paris",
    categoryNames: ["Догляд за волоссям"],
    isNew: true,
  },
  {
    name: "Repair & Care Hair Mask",
    description: "Інтенсивна маска для глибокого відновлення волосся",
    image: "https://picsum.photos/seed/hairmask1/400/400",
    price: 180,
    brandName: "Nivea",
    categoryNames: ["Догляд за волоссям"],
    isNew: false,
  },
  // Чоловічий догляд
  {
    name: "Men Creme",
    description: "Універсальний крем для обличчя та тіла для чоловіків",
    image: "https://picsum.photos/seed/mencream1/400/400",
    price: 160,
    brandName: "Nivea",
    categoryNames: ["Чоловічий догляд", "Догляд за шкірою"],
    isNew: false,
  },
  {
    name: "Men Sensitive Face Wash",
    description: "М'який гель для вмивання для чутливої чоловічої шкіри",
    image: "https://picsum.photos/seed/menwash1/400/400",
    price: 190,
    oldPrice: 230,
    brandName: "Nivea",
    categoryNames: ["Чоловічий догляд", "Догляд за шкірою"],
    isNew: true,
  },
  // Парфумерія
  {
    name: "La Vie Est Belle Eau de Parfum",
    description: "Жіночий парфум з нотами ірису, жасмину та ванілі",
    image: "https://picsum.photos/seed/perfume1/400/400",
    price: 2800,
    oldPrice: 3200,
    brandName: "L'Oréal Paris",
    categoryNames: ["Парфумерія"],
    isNew: false,
  },
  {
    name: "Men Deep Musk Spray",
    description: "Чоловічий дезодорант-спрей з мускусним ароматом",
    image: "https://picsum.photos/seed/perfume2/400/400",
    price: 140,
    brandName: "Nivea",
    categoryNames: ["Парфумерія", "Чоловічий догляд"],
    isNew: false,
  },
  // Аксесуари
  {
    name: "Professional Makeup Brush Set",
    description: "Набір з 12 професійних пензлів для макіяжу",
    image: "https://picsum.photos/seed/brushes1/400/400",
    price: 890,
    brandName: "NYX Professional Makeup",
    categoryNames: ["Аксесуари", "Макіяж"],
    isNew: true,
  },
  {
    name: "Makeup Sponge Blender",
    description: "Спонж для бездоганного нанесення тонального крему та консилера",
    image: "https://picsum.photos/seed/sponge1/400/400",
    price: 180,
    oldPrice: 220,
    brandName: "NYX Professional Makeup",
    categoryNames: ["Аксесуари", "Макіяж"],
    isNew: false,
  },
];

export function createProductsData(
  brands: Brand[],
  categories: Category[]
): ProductInput[] {
  const brandMap = new Map(brands.map((b) => [b.name, b.id]));
  const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

  return productsSeedData.map((product) => {
    const brandId = brandMap.get(product.brandName);
    const categoryIds = product.categoryNames
      .map((name) => categoryMap.get(name))
      .filter((id): id is number => id !== undefined);

    return {
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
      oldPrice: product.oldPrice,
      brandId,
      categoryIds,
      isActive: true,
      isNew: product.isNew ?? false,
    };
  });
}
