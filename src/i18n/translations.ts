import { Language } from '../types';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Branding & Core
    appName: 'Smriti',
    appTagline: 'Cognitive Care Platform',
    appStatement: 'Simple support for memory, routines and everyday care.',
    disclaimer: 'Smriti supports cognitive engagement and caregiver monitoring. It does not provide medical diagnosis.',
    
    // Roles & Navigation
    caregiver: 'Caregiver',
    patient: 'Patient',
    demoMode: 'Demo Mode',
    continueAsCaregiver: 'Continue as Caregiver',
    continueAsPatient: 'Continue as Patient',
    exploreDemo: 'Explore Demo Mode',
    
    // Navigation items
    navHome: 'Home',
    navGames: 'Games',
    navMedicines: 'Medicines',
    navRoutine: 'Routine',
    navDashboard: 'Dashboard',
    navPatients: 'Patients',
    navCarePlans: 'Care Plans',
    navProgress: 'Progress',
    navSettings: 'Settings',
    navExit: 'Exit',
    
    // Patient Greetings & microcopy
    goodMorning: 'Good morning',
    letsHaveAGoodDay: "Let's have a good day.",
    todaysMedication: "Today's medication",
    todaysActivities: "Today's activities",
    hearInstructions: 'Hear Instructions',
    
    // Actions
    taken: 'TAKEN',
    remindMeLater: 'REMIND ME LATER',
    markTaken: 'Mark as Taken',
    markPending: 'Reset to Pending',
    backToGames: '← Back to Games',
    done: 'DONE',
    start: 'Start',
    nextRound: 'Next Round',
    tryAgain: 'Try again',
    takeYourTime: 'Take your time',
    
    // Game Titles
    memoryMatch: 'Memory Match',
    findTheObject: 'Find the Object',
    completeThePattern: 'Complete the Pattern',
    routineRecall: 'Routine Recall',
    
    // Game In-game Microcopy
    findPromptPrefix: 'Find the',
    whichComesAfter: 'What comes after',
    whichComesBefore: 'What comes before',
    whatDoYouDoAt: 'What do you do at',
    whichComesFirst: 'Which comes first?',
    wellDone: 'Well done!',
    accuracy: 'Accuracy',
    correct: 'Correct',
    timeTaken: 'Time',
    difficulty: 'Difficulty',
    
    // Status
    morningDoseTaken: 'Morning dose taken',
    pendingDose: 'Pending dose',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    
    // Empty & Loading
    loading: 'Loading patient data...',
    noMedsScheduled: 'No medications scheduled today.',
    noRoutinesScheduled: 'No routine items scheduled.',
    noSessionsYet: 'No game sessions recorded yet.',
    saveSuccess: 'Changes saved successfully.',
    saveError: 'Unable to save changes. Please try again.',
  },
  
  as: {
    // Branding & Core
    appName: 'স্মৃতি',
    appTagline: 'জ্ঞানমূলক যত্ন মঞ্চ',
    appStatement: 'স্মৃতি, দৈনন্দিন নিয়ম আৰু সহজ যত্নৰ বাবে সহায়।',
    disclaimer: 'স্মৃতিয়ে স্মৃতিশক্তিৰ সংগতি আৰু পৰিচৰ্যাকৰ্তাৰ তত্বাৱধানত সহায় কৰে। ই কোনো চিকিৎসা নিদান নকৰে।',
    
    // Roles & Navigation
    caregiver: 'পৰিচৰ্যাকৰ্তা',
    patient: 'অভিভাৱ্য / ৰোগী',
    demoMode: 'ডেম’ মোড',
    continueAsCaregiver: 'পৰিচৰ্যাকৰ্তা হিচাপে যাওক',
    continueAsPatient: 'ৰোগী হিচাপে যাওক',
    exploreDemo: 'ডেম’ পৰীক্ষা কৰক',
    
    // Navigation items
    navHome: 'মুখ্য পৃষ্ঠা',
    navGames: 'খেলাসমূহ',
    navMedicines: 'ঔষধসমূহ',
    navRoutine: 'দৈনন্দিন তালিকা',
    navDashboard: 'ডেশ্বব’ৰ্ড',
    navPatients: 'ৰোগীসকল',
    navCarePlans: 'যত্ন পৰিকল্পনা',
    navProgress: 'অগ্ৰগতি',
    navSettings: 'ছেটিংছ',
    navExit: 'প্ৰস্থান',
    
    // Patient Greetings & microcopy
    goodMorning: 'শুভ প্ৰভাত',
    letsHaveAGoodDay: 'আজিৰ দিনটো আনন্দৰে কটাওক।',
    todaysMedication: 'আজিৰ ঔষধ',
    todaysActivities: 'আজিৰ কাৰ্যসূচী',
    hearInstructions: 'নিৰ্দেশনা শুনক',
    
    // Actions
    taken: 'গ্ৰহণ কৰা হ’ল',
    remindMeLater: 'পাছত সোঁৱৰাব',
    markTaken: 'ঔষধ গ্ৰহণ চিহ্নিত কৰক',
    markPending: 'বাকী থকা অৱস্থালৈ নিয়ক',
    backToGames: '← খেললৈ উভতি যাওক',
    done: 'সম্পূৰ্ণ হ’ল',
    start: 'আৰম্ভ কৰক',
    nextRound: 'পৰৱৰ্তী ৰাউণ্ড',
    tryAgain: 'পুনৰ চেষ্টা কৰক',
    takeYourTime: 'সময় লৈ উত্তৰ দিয়ক',
    
    // Game Titles
    memoryMatch: 'স্মৃতি সংগতি',
    findTheObject: 'বস্তু বিচাৰক',
    completeThePattern: 'শৃংখলা সম্পূৰ্ণ কৰক',
    routineRecall: 'দৈনন্দিন স্মৃতি',
    
    // Game In-game Microcopy
    findPromptPrefix: 'বিচাৰক',
    whichComesAfter: 'ইয়াৰ পাছত কি আহে',
    whichComesBefore: 'ইয়াৰ আগত কি আহে',
    whatDoYouDoAt: 'এই সময়ত আপুনি কি কৰে',
    whichComesFirst: 'কোনটো আগতে আহে?',
    wellDone: 'অতি উত্তম!',
    accuracy: 'সঠিকতা',
    correct: 'শুদ্ধ উত্তৰ',
    timeTaken: 'সময়',
    difficulty: 'স্তৰ',
    
    // Status
    morningDoseTaken: 'ৰাতিপুৱাৰ ঔষধ লোৱা হ’ল',
    pendingDose: 'বাকী আছে',
    easy: 'সহজ',
    medium: 'মধ্যম',
    hard: 'কঠিন',
    
    // Empty & Loading
    loading: 'তথ্য লোড হৈ আছে...',
    noMedsScheduled: 'আজিৰ বাবে কোনো ঔষধৰ সময়সূচী নাই।',
    noRoutinesScheduled: 'কোনো নিয়ম তালিকাভুক্ত কৰা হোৱা নাই।',
    noSessionsYet: 'এতিয়ালৈকে কোনো খেলৰ তথ্য নাই।',
    saveSuccess: 'পৰিবৰ্তন সফলভাৱে সংৰক্ষণ কৰা হ’ল।',
    saveError: 'সংৰক্ষণ কৰাত অসুবিধা হৈছে। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।',
  },
  
  lus: {
    // Branding & Core
    appName: 'Smriti',
    appTagline: 'Hriatna Tihchakna',
    appStatement: 'Hriatrengna, nitin hunbi leh inenkawlna tana ṭanpuitu.',
    disclaimer: 'Smriti hian hriatna tihchak leh enkawltu tan chanchin hriatna a pui a. Damdawi lam inentirna a ni lo.',
    
    // Roles & Navigation
    caregiver: 'Enkawltu',
    patient: 'Damlo',
    demoMode: 'Enchhinna',
    continueAsCaregiver: 'Enkawltu angin lut rawh',
    continueAsPatient: 'Damlo angin lut rawh',
    exploreDemo: 'Enchhinna hmang rawh',
    
    // Navigation items
    navHome: 'In',
    navGames: 'Infiahna',
    navMedicines: 'Damdawi',
    navRoutine: 'Nitin Hunbi',
    navDashboard: 'Dashboard',
    navPatients: 'Damlo te',
    navCarePlans: 'Enkawl dan',
    navProgress: 'Hmasawnna',
    navSettings: 'Settings',
    navExit: 'Chhuak rawh',
    
    // Patient Greetings & microcopy
    goodMorning: 'Chibai zing chibai',
    letsHaveAGoodDay: 'Vawiin chu ni nuam tak i hmang ang u.',
    todaysMedication: 'Vawiin damdawi',
    todaysActivities: 'Vawiin thiltih turte',
    hearInstructions: 'Hriattirna ngaithla rawh',
    
    // Actions
    taken: 'EI TAWH',
    remindMeLater: 'NAKINAH HRILH LEH RAWH',
    markTaken: 'Ei tawh angin dah rawh',
    markPending: 'La ei lo angin siam rawh',
    backToGames: '← Infiahna ah kir rawh',
    done: 'ZO TA',
    start: 'Bul tan rawh',
    nextRound: 'A dawt leh',
    tryAgain: 'Han ti nawn leh teh',
    takeYourTime: 'Hmanhmawh suh, muangchangin ti rawh',
    
    // Game Titles
    memoryMatch: 'Hriat kawp zawng',
    findTheObject: 'Thil zawng rawh',
    completeThePattern: 'A kalhmang zawm rawh',
    routineRecall: 'Hunbi hriatrengna',
    
    // Game In-game Microcopy
    findPromptPrefix: 'Zawng rawh',
    whichComesAfter: 'Eng nge a dawt tu',
    whichComesBefore: 'A hma a mi eng nge',
    whatDoYouDoAt: 'He hunah hian eng nge i tih',
    whichComesFirst: 'Khawi zawk hi nge hmasa?',
    wellDone: 'I ti ṭha hle mai!',
    accuracy: 'Dik zat',
    correct: 'A dik',
    timeTaken: 'Hun',
    difficulty: 'Harsat dan',
    
    // Status
    morningDoseTaken: 'Zing damdawi ei tawh',
    pendingDose: 'Ei a la ngai',
    easy: 'Awlsam',
    medium: 'Nangching',
    hard: 'Harsa',
    
    // Empty & Loading
    loading: 'Chanchin lakkhawm mek a ni...',
    noMedsScheduled: 'Vawiin atan damdawi a awm rih lo.',
    noRoutinesScheduled: 'Thiltih tur duan a la awm lo.',
    noSessionsYet: 'Infiahna record a la awm lo.',
    saveSuccess: 'Hlawhtling takin vawn a ni.',
    saveError: 'Vawn theih a ni lo, khawngaihin ti nawn leh rawh.',
  },
};
