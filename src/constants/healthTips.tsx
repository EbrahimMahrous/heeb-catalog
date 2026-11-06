import { createElement } from "react";
import {
  Leaf,
  Droplets,
  Apple,
  Flame,
  Snowflake,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Citrus,
  Salad,
  Milk,
  Utensils,
  Sun,
  Coffee,
} from "lucide-react";

export type TipCategory =
  | "washing"
  | "storage"
  | "nutrition"
  | "health"
  | "seasonal"
  | "preparation"
  | "general";

export interface HealthTip {
  id: number;
  category: TipCategory;
  tipAr: string;
  tipEn: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

const icon = (Component: any, className: string = "w-3.5 h-3.5") =>
  createElement(Component, { className });

export const HEALTH_TIPS: HealthTip[] = [
  {
    id: 1,
    category: "nutrition",
    tipAr: "قلب النخلة غني بالألياف والمغنيسيوم 💪",
    tipEn: "Heart of palm is rich in fiber & magnesium 💪",
    icon: icon(Leaf),
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 2,
    category: "preparation",
    tipAr: "قلب النخلة لذيذ مع السلطات أو لحالو 🥗",
    tipEn: "Heart of palm is delicious in salads or alone 🥗",
    icon: icon(Salad),
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    id: 3,
    category: "preparation",
    tipAr: "اللوز المقطع حامض مع ليمون ورمان 🍋",
    tipEn: "Sliced sour loz with lemon & pomegranate 🍋",
    icon: icon(Citrus),
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    id: 4,
    category: "nutrition",
    tipAr: "اللوز المقطع حلو أكل خفيف وصحي 🍬",
    tipEn: "Sweet sliced loz is a light & healthy snack 🍬",
    icon: icon(Heart),
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: 5,
    category: "seasonal",
    tipAr: "النبج فاكهة شتوية غنية بفيتامين C 🍈",
    tipEn: "Nabg is a winter fruit rich in Vitamin C 🍈",
    icon: icon(Apple),
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: 6,
    category: "health",
    tipAr: "النبج يقوي المناعة في الشتاء ❄️",
    tipEn: "Nabg strengthens immunity in winter ❄️",
    icon: icon(Snowflake),
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    id: 7,
    category: "nutrition",
    tipAr: "التوت الأحمر غني بمضادات الأكسدة 🍓",
    tipEn: "Red berries are rich in antioxidants 🍓",
    icon: icon(Heart),
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    id: 8,
    category: "preparation",
    tipAr: "مربى التوت الطبيعي مثالي مع الخبز 🍞",
    tipEn: "Natural berry jam is perfect with bread 🍞",
    icon: icon(Coffee),
    bgColor: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    id: 9,
    category: "health",
    tipAr: "عصير التوت الطبيعي يبرد القلب ❄️",
    tipEn: "Natural berry juice cools the heart ❄️",
    icon: icon(Droplets),
    bgColor: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  {
    id: 10,
    category: "preparation",
    tipAr: "الهمبا الحامض مع ملح وفلفل أحلى سناك 🥭",
    tipEn: "Sour humba with salt & pepper = best snack 🥭",
    icon: icon(Flame),
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: 11,
    category: "preparation",
    tipAr: "صوص همبا حامض يتحط مع المشاوي 🍗",
    tipEn: "Sour humba sauce goes great with BBQ 🍗",
    icon: icon(Utensils),
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: 12,
    category: "preparation",
    tipAr: "صوص همبا حلو مع الفطاير والآيس كريم 🍨",
    tipEn: "Sweet humba sauce with pancakes & ice cream 🍨",
    icon: icon(Heart),
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: 13,
    category: "preparation",
    tipAr: "آجار الهمبا مع الأكلات الشعبية لذه 👌",
    tipEn: "Humba pickle with traditional food is delicious 👌",
    icon: icon(Salad),
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 14,
    category: "preparation",
    tipAr: "آجار الليمون يعطي حموضة منعشة 🍋",
    tipEn: "Lemon pickle adds refreshing sourness 🍋",
    icon: icon(Citrus),
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    id: 15,
    category: "preparation",
    tipAr: "آجار اللوز مع المندي والبخاري 🍚",
    tipEn: "Loz pickle with mandi & bukhari rice 🍚",
    icon: icon(Flame),
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: 16,
    category: "preparation",
    tipAr: "آجار البمبر يجنن مع الأكلات الشعبية ✨",
    tipEn: "Bamber pickle is amazing with traditional food ✨",
    icon: icon(Leaf),
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    id: 17,
    category: "health",
    tipAr: "حليب بقر طازج بدون مواد حافظة 🥛",
    tipEn: "Fresh cow milk with no preservatives 🥛",
    icon: icon(Milk),
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 18,
    category: "health",
    tipAr: "اللبن الحامض سهل الهضم ومفيد للمعده 🫀",
    tipEn: "Sour yogurt is easy to digest & good for stomach 🫀",
    icon: icon(Heart),
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: 19,
    category: "preparation",
    tipAr: "السمن الطبيعي يرفع نكهة الأكل 👌",
    tipEn: "Natural ghee enhances the flavor of food 👌",
    icon: icon(Flame),
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: 20,
    category: "nutrition",
    tipAr: "الزبدة البقري غنية بفيتامينات A,D,E,K 🧈",
    tipEn: "Cow butter is rich in vitamins A, D, E, K 🧈",
    icon: icon(ShieldCheck),
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    id: 21,
    category: "preparation",
    tipAr: "الجبن البقري مصنوع من حليب طازج 🧀",
    tipEn: "Cow cheese is made from fresh milk 🧀",
    icon: icon(Apple),
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: 22,
    category: "health",
    tipAr: "حليب الماعز سهل الهضم ومناسب للجميع 🐐",
    tipEn: "Goat milk is easy to digest for everyone 🐐",
    icon: icon(Milk),
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 23,
    category: "health",
    tipAr: "عسل السدر الإماراتي طبيعي 100% 🍯",
    tipEn: "Emirati Sidr honey is 100% natural 🍯",
    icon: icon(Sun),
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: 24,
    category: "preparation",
    tipAr: "الجامي مع التمر والسمن وجبة تراثية 🇦🇪",
    tipEn: "Jameed with dates & ghee = traditional meal 🇦🇪",
    icon: icon(Heart),
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: 25,
    category: "nutrition",
    tipAr: "اليقط يقوي المناعة ويساعد الهضم 💪",
    tipEn: "Yogurt balls boost immunity & aid digestion 💪",
    icon: icon(ShieldCheck),
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    id: 26,
    category: "seasonal",
    tipAr: "الفرصاد ينعش الجسم في الصيف ☀️",
    tipEn: "Forsad refreshes the body in summer ☀️",
    icon: icon(Sun),
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: 27,
    category: "seasonal",
    tipAr: "البطيخ الأحمر يجيك من يحنا 🍉",
    tipEn: "Red watermelon is coming soon 🍉",
    icon: icon(Leaf),
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 28,
    category: "preparation",
    tipAr: "الصبار يسوي مشروب منعش 🥤",
    tipEn: "Tamarind makes a refreshing drink 🥤",
    icon: icon(Droplets),
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 29,
    category: "preparation",
    tipAr: "خل الليمون الطبيعي يرفع أي طبخة 🔥",
    tipEn: "Natural lemon vinegar elevates any dish 🔥",
    icon: icon(Flame),
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: 30,
    category: "general",
    tipAr: "باقة السلة المميزة هدية تراثية رائعة 🎁",
    tipEn: "Special basket is a great traditional gift 🎁",
    icon: icon(ShoppingBag),
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: 31,
    category: "preparation",
    tipAr: "شطة حيب الحارة تحمس الأكل 🔥",
    tipEn: "Heeb hot sauce spices up your food 🔥",
    icon: icon(Flame),
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: 32,
    category: "nutrition",
    tipAr: "جلي جوز الهند الطازج ينعش الجسم 🥥",
    tipEn: "Fresh coconut jelly refreshes the body 🥥",
    icon: icon(Sun),
    bgColor: "bg-amber-50",
    iconColor: "text-amber-700",
  },
];

export function shuffleTips(tips: HealthTip[]): HealthTip[] {
  const shuffled = [...tips];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
