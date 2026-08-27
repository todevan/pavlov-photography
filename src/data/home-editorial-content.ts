import { homeContent } from "@/data/home-content";

export const homeEditorialContent = {
  nav: [
    { label: "Работа", href: "#portfolio" },
    { label: "Услуги", href: "#services" },
    { label: "За мен", href: "#about" },
    { label: "Контакт", href: "#contact" },
  ],
  hero: {
    title: homeContent.hero.title,
    primaryCta: "Запази снимане",
    secondaryCta: "Виж услугите",
    images: [
      {
        src: "/portfolio/urban-apartment.png",
        alt: "Модерен градски апартамент с големи прозорци",
      },
      {
        src: "/portfolio/bmw-m-series.png",
        alt: "Бяло BMW на планински завой през есента",
      },
    ],
  },
  services: [
    {
      category: "real-estate",
      title: "Недвижими имоти",
      startingPrice: "от €30",
      audience: "За брокери, агенции, Airbnb и частни обяви.",
      href: "/services/real-estate",
      image: {
        src: "/portfolio/urban-apartment.png",
        alt: "Градски апартамент с естествена светлина",
      },
    },
    {
      category: "automotive",
      title: "Автомобили",
      startingPrice: "от €20",
      audience: "За частни обяви, автокъщи и премиум listings.",
      href: "/services/automotive",
      image: {
        src: "/portfolio/bmw-m-series.png",
        alt: "BMW M Series автомобилна фотография",
      },
    },
    {
      category: "products",
      title: "Продукти",
      startingPrice: "от €30",
      audience: "За e-commerce, социални мрежи и рекламни кампании.",
      href: "/services/products",
      image: null,
    },
  ],
  selectedWork: [
    {
      id: "bmw-m-series",
      label: "AUTOMOTIVE · BMW M SERIES",
      image: "/portfolio/bmw-m-series.png",
      alt: "Бяло BMW на планински завой през есента",
      href: "/portfolio/bmw-m-series",
      ratio: "wide",
    },
    {
      id: "ferrari-interior",
      label: "AUTOMOTIVE · INTERIOR DETAIL",
      image: "/portfolio/interior-detail.jpg",
      alt: "Бежов автомобилен интериор с дървени детайли",
      href: "/portfolio/ferrari-interior",
      ratio: "tall",
    },
    {
      id: "real-estate-living",
      label: "REAL ESTATE · SOFIA",
      image: "/portfolio/urban-apartment.png",
      alt: "Модерен градски апартамент с естествена светлина",
      href: "/portfolio/real-estate-living",
      ratio: "wide",
    },
  ],
  why: {
    title: "Професионално заснемане без излишно усложнение.",
    points: [
      "Ясна цена предварително",
      "Предаване до 24–48 часа",
      "Обработени готови файлове",
      "Директна комуникация с фотографа",
    ],
    name: "Теодор Павлов",
    role: "Commercial photographer · Sofia",
    href: "/about",
  },
  beforeAfter: homeContent.portfolio.beforeAfter,
} as const;
