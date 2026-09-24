import { CulturalItem } from '../../types/games';

export const CULTURAL_ITEMS: CulturalItem[] = [
  // Assam
  {
    id: 'xorai',
    name: {
      en: 'Xorai (Bell-metal Tray)',
      as: 'শৰাই',
      lus: 'Xorai dar thleng',
    },
    region: 'Assam',
    category: 'household',
    iconType: 'xorai',
  },
  {
    id: 'gamosa',
    name: {
      en: 'Gamosa (Woven Cloth)',
      as: 'গামোচা',
      lus: 'Gamosa puan',
    },
    region: 'Assam',
    category: 'textile',
    iconType: 'gamosa',
  },
  {
    id: 'jaapi',
    name: {
      en: 'Jaapi (Bamboo Hat)',
      as: 'জাপি',
      lus: 'Mau lukhum',
    },
    region: 'Assam',
    category: 'craft',
    iconType: 'jaapi',
  },
  {
    id: 'kaji_nemu',
    name: {
      en: 'Kaji Nemu (Assam Lemon)',
      as: 'কাজী নেমু',
      lus: 'Ser thur',
    },
    region: 'Assam',
    category: 'food',
    iconType: 'lemon',
  },
  {
    id: 'tea_leaves',
    name: {
      en: 'Tea Leaves',
      as: 'চাহ পাত',
      lus: 'Thingpui hnah',
    },
    region: 'Assam',
    category: 'nature',
    iconType: 'tea_leaves',
  },
  {
    id: 'muga_silk',
    name: {
      en: 'Muga Silk Fabric',
      as: 'মুগা ৰেচম',
      lus: 'Muga puanṭha',
    },
    region: 'Assam',
    category: 'textile',
    iconType: 'silk',
  },
  {
    id: 'bihu_dhol',
    name: {
      en: 'Dhol (Folk Drum)',
      as: 'ঢোল',
      lus: 'Khuang',
    },
    region: 'Assam',
    category: 'craft',
    iconType: 'drum',
  },
  {
    id: 'kopou_phool',
    name: {
      en: 'Fox-tail Orchid (Kopou)',
      as: 'কপৌ ফুল',
      lus: 'Orchid par',
    },
    region: 'Assam',
    category: 'nature',
    iconType: 'orchid',
  },

  // Mizoram
  {
    id: 'puan_textile',
    name: {
      en: 'Puan (Mizo Weave)',
      as: 'মিজো পুৱান কাপোৰ',
      lus: 'Puanchei',
    },
    region: 'Mizoram',
    category: 'textile',
    iconType: 'puan',
  },
  {
    id: 'thul_basket',
    name: {
      en: 'Thul (Cane Basket)',
      as: 'বেতৰ খৰাহী',
      lus: 'Thul (Em)',
    },
    region: 'Mizoram',
    category: 'craft',
    iconType: 'basket',
  },
  {
    id: 'cheraw_bamboo',
    name: {
      en: 'Cheraw Bamboo',
      as: 'বাঁহৰ বাদ্য',
      lus: 'Cheraw mau',
    },
    region: 'Mizoram',
    category: 'craft',
    iconType: 'bamboo',
  },
  {
    id: 'anthurium',
    name: {
      en: 'Anthurium Flower',
      as: 'এন্থুৰিয়াম ফুল',
      lus: 'Anthurium par sen',
    },
    region: 'Mizoram',
    category: 'nature',
    iconType: 'flower_red',
  },
  {
    id: 'mizo_khumbeu',
    name: {
      en: 'Khumbeu (Bamboo Sunhat)',
      as: 'মিজো বাঁহৰ টুপী',
      lus: 'Khumbeu',
    },
    region: 'Mizoram',
    category: 'craft',
    iconType: 'khumbeu',
  },
  {
    id: 'mountain_ginger',
    name: {
      en: 'Mountain Ginger',
      as: 'আদা',
      lus: 'Thing',
    },
    region: 'Mizoram',
    category: 'food',
    iconType: 'ginger',
  },
  {
    id: 'bamboo_flute',
    name: {
      en: 'Bamboo Flute',
      as: 'বাঁহী',
      lus: 'Mau phenglawng',
    },
    region: 'Mizoram',
    category: 'craft',
    iconType: 'flute',
  },
  {
    id: 'wild_orange',
    name: {
      en: 'Ser Citrus (Orange)',
      as: 'কমলা',
      lus: 'Sertawk',
    },
    region: 'Mizoram',
    category: 'food',
    iconType: 'orange',
  },

  // General NER
  {
    id: 'clay_cup',
    name: {
      en: 'Clay Tea Cup',
      as: 'মাটিৰ চাহৰ কাপ',
      lus: 'Hlum no',
    },
    region: 'NER General',
    category: 'household',
    iconType: 'cup',
  },
  {
    id: 'brass_kettle',
    name: {
      en: 'Tea Kettle',
      as: 'চাহৰ কেটলী',
      lus: 'Thingpui lumna',
    },
    region: 'NER General',
    category: 'household',
    iconType: 'kettle',
  },
  {
    id: 'rhododendron',
    name: {
      en: 'Rhododendron Bloom',
      as: 'ৰ’ড’ডেনড্ৰন ফুল',
      lus: 'Chhawkhlei par',
    },
    region: 'NER General',
    category: 'nature',
    iconType: 'rhododendron',
  },
  {
    id: 'mountain_jackfruit',
    name: {
      en: 'Jackfruit',
      as: 'কঠাল',
      lus: 'Lamtah',
    },
    region: 'NER General',
    category: 'food',
    iconType: 'jackfruit',
  },
  {
    id: 'handloom_shuttle',
    name: {
      en: 'Weaving Shuttle (Maku)',
      as: 'তাঁতৰ মাকো',
      lus: 'Kawtpui / Thelma',
    },
    region: 'NER General',
    category: 'craft',
    iconType: 'shuttle',
  },
  {
    id: 'brass_water_pot',
    name: {
      en: 'Brass Water Urn (Kalah)',
      as: 'পিতলৰ কলহ',
      lus: 'Dar tui bel',
    },
    region: 'NER General',
    category: 'household',
    iconType: 'water_pot',
  },
  {
    id: 'bamboo_fan',
    name: {
      en: 'Handmade Bamboo Fan',
      as: 'বাঁহৰ বিচনী',
      lus: 'Mau zapna',
    },
    region: 'NER General',
    category: 'household',
    iconType: 'fan',
  },
  {
    id: 'wooden_pestle',
    name: {
      en: 'Wooden Mortar & Pestle',
      as: 'উৰাল-খুন্দনা',
      lus: 'Sum leh suhpawl',
    },
    region: 'NER General',
    category: 'household',
    iconType: 'pestle',
  },
];
