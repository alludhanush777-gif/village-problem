'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'en' | 'te' | 'hi';
type Theme = 'light' | 'dark' | 'system';

interface Translations {
  [key: string]: {
    en: string;
    te: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Common
  home: { en: 'Home', te: 'హోమ్', hi: 'होम' },
  camera: { en: 'Camera', te: 'కెమెరా', hi: 'कैमरा' },
  report: { en: 'Report', te: 'రిపోర్ట్', hi: 'रिपोर्ट' },
  history: { en: 'History', te: 'చరిత్ర', hi: 'इतिहास' },
  settings: { en: 'Settings', te: 'సెట్టింగ్‌లు', hi: 'सेटिंग्स' },
  profile: { en: 'Profile', te: 'ప్రొఫైల్', hi: 'प्रोफ़ाइल' },
  logout: { en: 'Logout', te: 'లాగ్ అవుట్', hi: 'लॉग आउट' },
  
  // Dashboard
  dashboard: { en: 'Dashboard', te: 'డాష్‌బోర్డ్', hi: 'डैशबोर्ड' },
  mapView: { en: 'Map View', te: 'మ్యాప్ వ్యూ', hi: 'मैप व्यू' },
  faults: { en: 'Faults', te: 'లోపాలు', hi: 'दोष' },
  technicians: { en: 'Technicians', te: 'టెక్నీషియన్లు', hi: 'तकनीशियन' },
  villages: { en: 'Villages', te: 'గ్రామాలు', hi: 'गाँव' },
  analytics: { en: 'Analytics', te: 'విశ్లేషణలు', hi: 'विश्लेषण' },
  
  // Fault Reporter
  energyFaultReporter: { en: 'Energy Fault Reporter', te: 'ఎనర్జీ ఫాల్ట్ రిపోర్టర్', hi: 'ऊर्जा दोष रिपोर्टर' },
  welcome: { en: 'Welcome', te: 'స్వాగతం', hi: 'स्वागत' },
  reportNewFault: { en: 'Report New Fault', te: 'కొత్త లోపాన్ని నివేదించండి', hi: 'नई गलती की रिपोर्ट करें' },
  quickActions: { en: 'Quick Actions', te: 'త్వరిత చర్యలు', hi: 'त्वरित क्रियाएँ' },
  totalReports: { en: 'Total Reports', te: 'మొత్తం నివేదికలు', hi: 'कुल रिपोर्ट' },
  pending: { en: 'Pending', te: 'పెండింగ్', hi: 'लंबित' },
  resolved: { en: 'Resolved', te: 'పరిష్కరించబడింది', hi: 'हल किया गया' },
  inProgress: { en: 'In Progress', te: 'ప్రోగ్రెస్‌లో', hi: 'प्रगति पर है' },
  
  // Settings page
  language: { en: 'Language', te: 'భాష', hi: 'भाषा' },
  theme: { en: 'Theme', te: 'థీమ్', hi: 'थीम' },
  lightMode: { en: 'Light', te: 'లైట్', hi: 'लाइट' },
  darkMode: { en: 'Dark', te: 'డార్క్', hi: 'डार्क' },
  systemMode: { en: 'System', te: 'సిస్టమ్', hi: 'सिस्टम' },
  english: { en: 'English', te: 'ఆంగ్లం', hi: 'अंग्रेज़ी' },
  telugu: { en: 'Telugu', te: 'తెలుగు', hi: 'तेलुगु' },
  hindi: { en: 'Hindi', te: 'హిందీ', hi: 'हिंदी' },
  
  // Profile
  personalDetails: { en: 'Personal Details', te: 'వ్యక్తిగత వివరాలు', hi: 'व्यक्तिगत विवरण' },
  name: { en: 'Name', te: 'పేరు', hi: 'नाम' },
  phone: { en: 'Phone', te: 'ఫోన్', hi: 'फ़ोन' },
  email: { en: 'Email', te: 'ఇమెయిల్', hi: 'ईमेल' },
  village: { en: 'Village', te: 'గ్రామం', hi: 'गाँव' },
  role: { en: 'Role', te: 'పాత్ర', hi: 'भूमिका' },
  memberSince: { en: 'Member Since', te: 'సభ్యుడు అప్పటి నుండి', hi: 'सदस्य तब से' },
  assignedAreas: { en: 'Assigned Areas', te: 'కేటాయించిన ప్రాంతాలు', hi: 'निर्धारित क्षेत्र' },
  reporter: { en: 'Reporter', te: 'రిపోర్టర్', hi: 'रिपोर्टर' },
  technician: { en: 'Technician', te: 'టెక్నీషియన్', hi: 'तकनीशियन' },
  admin: { en: 'Admin', te: 'అడ్మిన్', hi: 'व्यवस्थापक' },
  
  // Report form
  faultImage: { en: 'Fault Image', te: 'లోప చిత్రం', hi: 'दोष छवि' },
  selectVillage: { en: 'Select Village', te: 'గ్రామాన్ని ఎంచుకోండి', hi: 'गाँव चुनें' },
  deviceType: { en: 'Device Type', te: 'పరికర రకం', hi: 'डिवाइस प्रकार' },
  problemDescription: { en: 'Problem Description', te: 'సమస్య వివరణ', hi: 'समस्या विवरण' },
  urgencyLevel: { en: 'Urgency Level', te: 'అత్యవసర స్థాయి', hi: 'अत्यावश्यकता स्तर' },
  location: { en: 'Location', te: 'స్థానం', hi: 'स्थान' },
  getLocation: { en: 'Get Location', te: 'స్థానాన్ని పొందండి', hi: 'स्थान प्राप्त करें' },
  submit: { en: 'Submit Fault Report', te: 'లోప నివేదికను సమర్పించండి', hi: 'दोष रिपोर्ट सबमिट करें' },
  
  // Devices
  solarPanel: { en: 'Solar Panel', te: 'సోలార్ ప్యానెల్', hi: 'सोलर पैनल' },
  microgrid: { en: 'Microgrid', te: 'మైక్రోగ్రిడ్', hi: 'माइक्रोग्रिड' },
  inverter: { en: 'Inverter', te: 'ఇన్వర్టర్', hi: 'इन्वर्टर' },
  battery: { en: 'Battery', te: 'బ్యాటరీ', hi: 'बैटरी' },
  transformer: { en: 'Transformer', te: 'ట్రాన్స్ఫార్మర్', hi: 'ट्रांसफॉर्मर' },
  
  // Urgency
  low: { en: 'Low - Minor issue', te: 'తక్కువ - చిన్న సమస్య', hi: 'कम - छोटी समस्या' },
  medium: { en: 'Medium - Needs attention', te: 'మధ్యస్థ - శ్రద్ధ అవసరం', hi: 'मध्यम - ध्यान देने की जरूरत' },
  high: { en: 'High - Urgent', te: 'అధిక - అత్యవసరం', hi: 'उच्च - अत्यावश्यक' },
  critical: { en: 'Critical - Emergency', te: 'క్రిటికల్ - అత్యవసర పరిస్థితి', hi: 'गंभीर - आपातकाल' },
  
  // Notifications
  notifications: { en: 'Notifications', te: 'నోటిఫికేషన్లు', hi: 'सूचनाएं' },
  smsNotifications: { en: 'SMS Notifications', te: 'SMS నోటిఫికేషన్లు', hi: 'SMS सूचनाएं' },
  appNotifications: { en: 'App Notifications', te: 'యాప్ నోటిఫికేషన్లు', hi: 'ऐप सूचनाएं' },
  
  // Map
  manualLocationSelection: { en: 'Manual Location Selection', te: 'మాన్యువల్ స్థానం ఎంపిక', hi: 'मैनुअल स्थान चयन' },
  selectDistrict: { en: 'Select District', te: 'జిల్లాను ఎంచుకోండి', hi: 'जिला चुनें' },
  selectMandal: { en: 'Select Mandal', te: 'మండలాన్ని ఎంచుకోండి', hi: 'मंडल चुनें' },
  
  // Status messages
  faultReportedSuccess: { en: 'Fault Reported Successfully!', te: 'లోపం విజయవంతంగా నివేదించబడింది!', hi: 'दोष सफलतापूर्वक रिपोर्ट किया गया!' },
  technicianNotified: { en: 'The assigned technician has been notified via SMS', te: 'కేటాయించిన టెక్నీషియన్‌కు SMS ద్వారా తెలియజేయబడింది', hi: 'नियुक्त तकनीशियन को SMS द्वारा सूचित किया गया है' },
};

interface SettingsContextType {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language;
    const storedTheme = localStorage.getItem('theme') as Theme;
    
    if (storedLang) setLanguageState(storedLang);
    if (storedTheme) setThemeState(storedTheme);
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (translation) {
      return translation[language] || translation['en'] || key;
    }
    return key;
  };

  return (
    <SettingsContext.Provider value={{ language, theme, setLanguage, setTheme, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
