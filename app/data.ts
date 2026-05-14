export type Role = "USER" | "SHOP" | "MASTER";

export type Shop = {
  id: string;
  name: string;
  username: string;
  city: string;
  whatsapp: string;
  isVerified: boolean;
  isActive: boolean;
  cover: string;
  avatar: string;
  views: number;
};

export type Car = {
  id: string;
  shopId: string;
  name: string;
  brand: string;
  plate: string;
  color: string;
  year: number;
  km: number;
  price: number;
  fipe: number;
  commission?: number;
  description: string;
  repasseNote?: string;
  isRepasse: boolean;
  views: number;
  leads: number;
  optional: string[];
  images: string[];
  shopName?: string;
  shopUsername?: string;
  shopWhatsapp?: string;
  shopCity?: string;
};

export const shops: Shop[] = [
  {
    id: "prime",
    name: "Prime Motors",
    username: "primemotors",
    city: "Sao Paulo, SP",
    whatsapp: "5511999999999",
    isVerified: true,
    isActive: true,
    cover:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=400&q=80",
    views: 1840,
  },
  {
    id: "autohaus",
    name: "AutoHaus Select",
    username: "autohaus",
    city: "Campinas, SP",
    whatsapp: "5511988887777",
    isVerified: true,
    isActive: true,
    cover:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=400&q=80",
    views: 1220,
  },
  {
    id: "garage",
    name: "Garage 45",
    username: "garage45",
    city: "Curitiba, PR",
    whatsapp: "5541991112222",
    isVerified: false,
    isActive: true,
    cover:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=400&q=80",
    views: 760,
  },
];

export const cars: Car[] = [
  {
    id: "civic-touring",
    shopId: "prime",
    name: "Honda Civic Touring",
    brand: "Honda",
    plate: "RFA3B21",
    color: "Prata",
    year: 2022,
    km: 31500,
    price: 146900,
    fipe: 149200,
    description:
      "Sedan unico dono, revisoes em concessionaria, pacote completo de seguranca e acabamento premium.",
    isRepasse: false,
    views: 482,
    leads: 38,
    optional: ["Ar digital", "Direcao eletrica", "Camera 360", "Teto solar"],
    images: [
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "compass-limited",
    shopId: "autohaus",
    name: "Jeep Compass Limited",
    brand: "Jeep",
    plate: "DTA8F10",
    color: "Branco",
    year: 2021,
    km: 46800,
    price: 137500,
    fipe: 140300,
    description:
      "SUV completo, multimidia grande, couro, chave presencial e historico de manutencao.",
    isRepasse: false,
    views: 390,
    leads: 29,
    optional: ["Couro", "CarPlay", "Piloto automatico", "Sensor de chuva"],
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "corolla-xei",
    shopId: "garage",
    name: "Toyota Corolla XEi",
    brand: "Toyota",
    plate: "PLO9C42",
    color: "Cinza",
    year: 2020,
    km: 52200,
    price: 118900,
    fipe: 121000,
    description:
      "Corolla muito conservado, pneus novos, laudo cautelar aprovado e garantia de motor e cambio.",
    isRepasse: false,
    views: 545,
    leads: 44,
    optional: ["Ar digital", "Banco em couro", "Controle de tracao", "Multimidia"],
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "nivus-highline",
    shopId: "prime",
    name: "VW Nivus Highline",
    brand: "Volkswagen",
    plate: "MQT7H90",
    color: "Azul",
    year: 2023,
    km: 18800,
    price: 129900,
    fipe: 131500,
    description:
      "Nivus turbo com painel digital, pacote ADAS, rodas diamantadas e garantia de fabrica.",
    isRepasse: false,
    views: 361,
    leads: 25,
    optional: ["ACC", "Painel digital", "Partida por botao", "Camera de re"],
    images: [
      "https://images.unsplash.com/photo-1549927681-0b673b8243ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "hilux-srv-repasse",
    shopId: "autohaus",
    name: "Toyota Hilux SRV",
    brand: "Toyota",
    plate: "HXU2R78",
    color: "Preto",
    year: 2019,
    km: 88400,
    price: 172000,
    fipe: 183400,
    commission: 6500,
    description:
      "Caminhonete diesel 4x4, mecanica revisada, pequena recuperacao estetica ja considerada no preco.",
    repasseNote:
      "Oportunidade para lojista: margem forte, documentacao pronta e cliente aceita proposta rapida.",
    isRepasse: true,
    views: 210,
    leads: 17,
    optional: ["4x4", "Diesel", "Santo Antonio", "Couro"],
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "onix-ltz-repasse",
    shopId: "prime",
    name: "Chevrolet Onix LTZ",
    brand: "Chevrolet",
    plate: "QWE5A19",
    color: "Vermelho",
    year: 2018,
    km: 73900,
    price: 54500,
    fipe: 60200,
    commission: 2800,
    description:
      "Hatch automatico com boa liquidez, precisa polimento e troca de dois pneus.",
    repasseNote:
      "Carro de giro rapido para entrada de estoque popular. Repasse somente para lojistas.",
    isRepasse: true,
    views: 178,
    leads: 14,
    optional: ["Automatico", "MyLink", "Sensor de estacionamento", "Ar condicionado"],
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

export const users = [
  {
    id: "master",
    name: "Administrador",
    username: "admin",
    email: "admin@vitrineauto.com",
    whatsapp: "5511000000000",
    city: "Brasil",
    role: "MASTER" as Role,
    isActive: true,
  },
  ...shops.map((shop) => ({
    id: shop.id,
    name: shop.name,
    username: shop.username,
    email: `${shop.username}@vitrineauto.com`,
    whatsapp: shop.whatsapp,
    city: shop.city,
    role: "SHOP" as Role,
    isActive: shop.isActive,
  })),
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatKm(value: number) {
  return `${new Intl.NumberFormat("pt-BR").format(value)} km`;
}

export function getShop(shopId: string) {
  return shops.find((shop) => shop.id === shopId);
}

export function getCarsByShop(shopId: string) {
  return cars.filter((car) => car.shopId === shopId);
}

export const optionals = Array.from(new Set(cars.flatMap((car) => car.optional))).sort();
