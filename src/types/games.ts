export interface CulturalItem {
  id: string;
  name: {
    en: string;
    as: string;
    lus: string;
  };
  region: 'Assam' | 'Mizoram' | 'NER General';
  category: 'textile' | 'craft' | 'nature' | 'household' | 'food';
  iconType: string;
}

export interface MemoryCard {
  cardId: string;
  itemId: string;
  name: string;
  iconType: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface SceneObject {
  id: string;
  name: {
    en: string;
    as: string;
    lus: string;
  };
  iconType: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  size: number;
}

export interface VisualScene {
  id: string;
  name: {
    en: string;
    as: string;
    lus: string;
  };
  themeColor: string;
  bgSvgType: 'veranda' | 'teaGarden' | 'kitchen' | 'villageYard' | 'market';
  objects: SceneObject[];
}

export interface PatternElement {
  id: string;
  label: {
    en: string;
    as: string;
    lus: string;
  };
  iconType: string;
  color: string;
}

export interface PatternRound {
  sequence: (PatternElement | null)[];
  missingIndex: number;
  correctAnswer: PatternElement;
  options: PatternElement[];
  ruleDescription: string;
}

export interface RoutineQuestion {
  id: string;
  questionType: 'after' | 'before' | 'at_time' | 'order_which_first' | 'sequence';
  prompt: {
    en: string;
    as: string;
    lus: string;
  };
  options: string[];
  correctAnswer: string;
  referenceTime?: string;
}
