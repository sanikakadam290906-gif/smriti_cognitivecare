import { VisualScene } from '../../types/games';

export const VISUAL_SCENES: VisualScene[] = [
  {
    id: 'scene-veranda',
    name: {
      en: 'Home Veranda',
      as: 'ঘৰৰ বাৰাণ্ডা',
      lus: 'In kawtlai / Veranda',
    },
    themeColor: '#FAF6EF',
    bgSvgType: 'veranda',
    objects: [
      { id: 'thul_basket', name: { en: 'Cane Basket', as: 'বেতৰ খৰাহী', lus: 'Thul' }, iconType: 'basket', xPercent: 22, yPercent: 68, size: 56 },
      { id: 'clay_cup', name: { en: 'Clay Cup', as: 'মাটিৰ কাপ', lus: 'Hlum no' }, iconType: 'cup', xPercent: 54, yPercent: 55, size: 48 },
      { id: 'bamboo_fan', name: { en: 'Bamboo Fan', as: 'বাঁহৰ বিচনী', lus: 'Mau zapna' }, iconType: 'fan', xPercent: 78, yPercent: 42, size: 52 },
      { id: 'brass_kettle', name: { en: 'Tea Kettle', as: 'কেটলী', lus: 'Thingpui lumna' }, iconType: 'kettle', xPercent: 44, yPercent: 52, size: 50 },
      { id: 'jaapi', name: { en: 'Jaapi Hat', as: 'জাপি', lus: 'Mau lukhum' }, iconType: 'jaapi', xPercent: 82, yPercent: 20, size: 60 },
      { id: 'wooden_pestle', name: { en: 'Wooden Pestle', as: 'খুন্দনা', lus: 'Suhpawl' }, iconType: 'pestle', xPercent: 12, yPercent: 75, size: 46 },
    ],
  },
  {
    id: 'scene-tea-garden',
    name: {
      en: 'Tea Garden & Trail',
      as: 'চাহ বাগিচাৰ পথ',
      lus: 'Thingpui huan kawng',
    },
    themeColor: '#F3F7F4',
    bgSvgType: 'teaGarden',
    objects: [
      { id: 'tea_leaves', name: { en: 'Tea Leaves', as: 'চাহ পাত', lus: 'Thingpui hnah' }, iconType: 'tea_leaves', xPercent: 48, yPercent: 62, size: 48 },
      { id: 'thul_basket', name: { en: 'Tea Basket', as: 'খৰাহী', lus: 'Thul' }, iconType: 'basket', xPercent: 72, yPercent: 65, size: 58 },
      { id: 'jaapi', name: { en: 'Jaapi Sunhat', as: 'জাপি', lus: 'Khumbeu' }, iconType: 'jaapi', xPercent: 25, yPercent: 35, size: 58 },
      { id: 'brass_water_pot', name: { en: 'Water Pot', as: 'কলহ', lus: 'Tui bel' }, iconType: 'water_pot', xPercent: 15, yPercent: 72, size: 54 },
      { id: 'kaji_nemu', name: { en: 'Lemon', as: 'কাজী নেমু', lus: 'Ser thur' }, iconType: 'lemon', xPercent: 60, yPercent: 78, size: 44 },
    ],
  },
  {
    id: 'scene-kitchen-hearth',
    name: {
      en: 'Traditional Kitchen',
      as: 'পাকঘৰ',
      lus: 'Choka / Ei rawngbawlna',
    },
    themeColor: '#FAF6EE',
    bgSvgType: 'kitchen',
    objects: [
      { id: 'clay_cup', name: { en: 'Clay Cup', as: 'মাটিৰ কাপ', lus: 'Hlum no' }, iconType: 'cup', xPercent: 68, yPercent: 48, size: 48 },
      { id: 'brass_kettle', name: { en: 'Tea Kettle', as: 'কেটলী', lus: 'Thingpui lumna' }, iconType: 'kettle', xPercent: 32, yPercent: 50, size: 56 },
      { id: 'wooden_pestle', name: { en: 'Mortar & Pestle', as: 'উৰাল-খুন্দনা', lus: 'Sum leh suhpawl' }, iconType: 'pestle', xPercent: 16, yPercent: 64, size: 52 },
      { id: 'mountain_ginger', name: { en: 'Fresh Ginger', as: 'আদা', lus: 'Thing' }, iconType: 'ginger', xPercent: 48, yPercent: 66, size: 46 },
      { id: 'kaji_nemu', name: { en: 'Lemon', as: 'নেমু', lus: 'Ser' }, iconType: 'lemon', xPercent: 82, yPercent: 68, size: 42 },
      { id: 'brass_water_pot', name: { en: 'Brass Urn', as: 'পিতলৰ কলহ', lus: 'Dar bel' }, iconType: 'water_pot', xPercent: 84, yPercent: 32, size: 54 },
    ],
  },
  {
    id: 'scene-village-yard',
    name: {
      en: 'Village Yard & Loom',
      as: 'গাঁৱৰ চোতাল আৰু তাঁতশাল',
      lus: 'Kawtlaia Thelma / Puan tahna',
    },
    themeColor: '#FAF7F2',
    bgSvgType: 'villageYard',
    objects: [
      { id: 'handloom_shuttle', name: { en: 'Weaving Shuttle', as: 'মাকো', lus: 'Thelma' }, iconType: 'shuttle', xPercent: 42, yPercent: 55, size: 50 },
      { id: 'muga_silk', name: { en: 'Woven Cloth', as: 'কাপোৰ', lus: 'Puan' }, iconType: 'silk', xPercent: 65, yPercent: 45, size: 56 },
      { id: 'cheraw_bamboo', name: { en: 'Bamboo Stems', as: 'বাঁহৰ চটা', lus: 'Cheraw mau' }, iconType: 'bamboo', xPercent: 20, yPercent: 70, size: 54 },
      { id: 'anthurium', name: { en: 'Anthurium Flower', as: 'ফুল', lus: 'Par sen' }, iconType: 'flower_red', xPercent: 80, yPercent: 62, size: 50 },
      { id: 'bamboo_fan', name: { en: 'Bamboo Fan', as: 'বিচনী', lus: 'Zapna' }, iconType: 'fan', xPercent: 15, yPercent: 40, size: 50 },
    ],
  },
  {
    id: 'scene-morning-market',
    name: {
      en: 'Morning Fresh Market',
      as: 'ৰাতিপুৱাৰ বজাৰ',
      lus: 'Zing bazar huan',
    },
    themeColor: '#F8F5EE',
    bgSvgType: 'market',
    objects: [
      { id: 'wild_orange', name: { en: 'Sweet Orange', as: 'কমলা', lus: 'Sertawk' }, iconType: 'orange', xPercent: 35, yPercent: 64, size: 48 },
      { id: 'thul_basket', name: { en: 'Cane Basket', as: 'খৰাহী', lus: 'Thul' }, iconType: 'basket', xPercent: 18, yPercent: 58, size: 60 },
      { id: 'mountain_jackfruit', name: { en: 'Jackfruit', as: 'কঠাল', lus: 'Lamtah' }, iconType: 'jackfruit', xPercent: 78, yPercent: 65, size: 62 },
      { id: 'mountain_ginger', name: { en: 'Ginger', as: 'আদা', lus: 'Thing' }, iconType: 'ginger', xPercent: 55, yPercent: 70, size: 46 },
      { id: 'kaji_nemu', name: { en: 'Lemon', as: 'কাজী নেমু', lus: 'Ser thur' }, iconType: 'lemon', xPercent: 52, yPercent: 52, size: 44 },
    ],
  },
];
