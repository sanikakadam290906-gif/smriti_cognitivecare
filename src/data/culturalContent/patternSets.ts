import { PatternElement } from '../../types/games';

export const PATTERN_VISUAL_SETS: { name: string; elements: PatternElement[] }[] = [
  {
    name: 'Regional Flowers',
    elements: [
      { id: 'orchid', label: { en: 'Orchid', as: 'কপৌ ফুল', lus: 'Orchid' }, iconType: 'orchid', color: '#D87093' },
      { id: 'rhododendron', label: { en: 'Rhododendron', as: 'ৰ’ড’ডেনড্ৰন', lus: 'Chhawkhlei' }, iconType: 'rhododendron', color: '#C72C41' },
      { id: 'marigold', label: { en: 'Marigold', as: 'গেন্দা ফুল', lus: 'Chhura par' }, iconType: 'marigold', color: '#E59866' },
      { id: 'anthurium', label: { en: 'Anthurium', as: 'এন্থুৰিয়াম', lus: 'Par sen' }, iconType: 'flower_red', color: '#B03A2E' },
    ],
  },
  {
    name: 'Traditional Weaving Motifs',
    elements: [
      { id: 'diamond_motif', label: { en: 'Diamond Weave', as: 'হিৰা চানেকি', lus: 'Mual li' }, iconType: 'diamond', color: '#4E7A5A' },
      { id: 'chevron_motif', label: { en: 'Zigzag Chevron', as: 'বঁকা ৰেখা', lus: 'Zikzak kual' }, iconType: 'chevron', color: '#C87449' },
      { id: 'star_motif', label: { en: 'Sun Star', as: 'তৰা চানেকি', lus: 'Arsi thil' }, iconType: 'star', color: '#B7950B' },
      { id: 'braid_motif', label: { en: 'Braided Leaf', as: 'পাতৰ বাণি', lus: 'Hnah zik' }, iconType: 'leaf_braid', color: '#34495E' },
    ],
  },
  {
    name: 'Nature & Harvest',
    elements: [
      { id: 'tea_leaf', label: { en: 'Tea Leaf', as: 'চাহ পাত', lus: 'Thingpui hnah' }, iconType: 'tea_leaves', color: '#27AE60' },
      { id: 'lemon_slice', label: { en: 'Citrus', as: 'নেমু', lus: 'Ser' }, iconType: 'lemon', color: '#F1C40F' },
      { id: 'bamboo_shoot', label: { en: 'Bamboo', as: 'বাঁহ', lus: 'Mau' }, iconType: 'bamboo', color: '#16A085' },
      { id: 'sweet_orange', label: { en: 'Orange', as: 'কমলা', lus: 'Sertawk' }, iconType: 'orange', color: '#E67E22' },
    ],
  },
  {
    name: 'Calm Geometric Forms',
    elements: [
      { id: 'circle_sage', label: { en: 'Circle', as: 'বৃত্ত', lus: 'Vun' }, iconType: 'circle', color: '#527961' },
      { id: 'square_peach', label: { en: 'Square', as: 'বৰ্গক্ষেত্ৰ', lus: 'Mual li' }, iconType: 'square', color: '#C87449' },
      { id: 'triangle_sky', label: { en: 'Triangle', as: 'ত্ৰিভুজ', lus: 'Kil thum' }, iconType: 'triangle', color: '#4B778B' },
      { id: 'diamond_lavender', label: { en: 'Rhombus', as: 'ৰম্বচ', lus: 'Mual zik' }, iconType: 'rhombus', color: '#7A7593' },
    ],
  },
];

export const PATTERN_RULES = [
  // Easy patterns
  { id: 'ABAB', structure: [0, 1, 0, 1], difficulty: 'Easy', missingIndex: 3 },
  { id: 'AABB', structure: [0, 0, 1, 1], difficulty: 'Easy', missingIndex: 3 },
  { id: 'ABBA', structure: [0, 1, 1, 0], difficulty: 'Easy', missingIndex: 3 },
  
  // Medium patterns
  { id: 'ABCAB', structure: [0, 1, 2, 0, 1], difficulty: 'Medium', missingIndex: 4 },
  { id: 'AABA', structure: [0, 0, 1, 0, 0], difficulty: 'Medium', missingIndex: 4 },
  { id: 'ABCBA', structure: [0, 1, 2, 1, 0], difficulty: 'Medium', missingIndex: 4 },
  
  // Hard patterns
  { id: 'ABCDABC', structure: [0, 1, 2, 3, 0, 1, 2], difficulty: 'Hard', missingIndex: 6 },
  { id: 'ABBCCAA', structure: [0, 1, 1, 2, 2, 0], difficulty: 'Hard', missingIndex: 5 },
  { id: 'ABACABA', structure: [0, 1, 0, 2, 0, 1, 0], difficulty: 'Hard', missingIndex: 6 },
];
