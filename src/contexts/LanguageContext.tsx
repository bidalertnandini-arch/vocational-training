import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'en' | 'te';

interface Translations {
  [key: string]: {
    en: string;
    te: string;
  };
}

// Core translations for the application
export const translations: Translations = {
  // Header & Navigation
  'app.title': {
    en: 'ITI Faculty Monitoring System',
    te: 'ఐటీఐ ఫ్యాకల్టీ పర్యవేక్షణ వ్యవస్థ',
  },
  'app.subtitle': {
    en: 'Department of Employment & Training, Andhra Pradesh',
    te: 'ఉపాధి & శిక్షణ శాఖ, ఆంధ్రప్రదేశ్',
  },
  'nav.dashboard': {
    en: 'Dashboard',
    te: 'డాష్‌బోర్డ్',
  },
  'nav.faculty': {
    en: 'Faculty',
    te: 'ఫ్యాకల్టీ',
  },
  'nav.institutes': {
    en: 'Institutes',
    te: 'సంస్థలు',
  },
  'nav.attendance': {
    en: 'Attendance',
    te: 'హాజరు',
  },
  'nav.sessions': {
    en: 'Sessions',
    te: 'సెషన్‌లు',
  },
  'nav.feedback': {
    en: 'Feedback',
    te: 'అభిప్రాయం',
  },
  'nav.alerts': {
    en: 'Alerts',
    te: 'హెచ్చరికలు',
  },
  'nav.reports': {
    en: 'Reports',
    te: 'నివేదికలు',
  },
  'nav.settings': {
    en: 'Settings',
    te: 'సెట్టింగ్‌లు',
  },
  'nav.logout': {
    en: 'Logout',
    te: 'లాగ్అవుట్',
  },

  // Login Page
  'login.title': {
    en: 'Sign In',
    te: 'సైన్ ఇన్',
  },
  'login.subtitle': {
    en: 'Access the ITI Monitoring Dashboard',
    te: 'ITI పర్యవేక్షణ డాష్‌బోర్డ్‌ను యాక్సెస్ చేయండి',
  },
  'login.username': {
    en: 'Username',
    te: 'యూజర్ నేమ్',
  },
  'login.password': {
    en: 'Password',
    te: 'పాస్‌వర్డ్',
  },
  'login.button': {
    en: 'Sign In',
    te: 'సైన్ ఇన్',
  },
  'login.demo': {
    en: 'Demo Accounts',
    te: 'డెమో ఖాతాలు',
  },
  'login.role.admin': {
    en: 'Administrator',
    te: 'అడ్మినిస్ట్రేటర్',
  },
  'login.role.dto': {
    en: 'District Training Officer',
    te: 'జిల్లా శిక్షణ అధికారి',
  },
  'login.role.principal': {
    en: 'Principal',
    te: 'ప్రిన్సిపాల్',
  },
  'login.role.faculty': {
    en: 'Faculty',
    te: 'ఫ్యాకల్టీ',
  },

  // Dashboard KPIs
  'kpi.attendance': {
    en: 'Overall Attendance',
    te: 'మొత్తం హాజరు',
  },
  'kpi.engagement': {
    en: 'Avg. Engagement',
    te: 'సగటు నిశ్చితార్థం',
  },
  'kpi.violations': {
    en: 'Active Alerts',
    te: 'యాక్టివ్ హెచ్చరికలు',
  },
  'kpi.feedback': {
    en: 'Positive Feedback',
    te: 'సానుకూల అభిప్రాయం',
  },
  'kpi.totalInstitutes': {
    en: 'Total Institutes',
    te: 'మొత్తం సంస్థలు',
  },
  'kpi.totalFaculty': {
    en: 'Total Faculty',
    te: 'మొత్తం ఫ్యాకల్టీ',
  },

  // Tables & Lists
  'table.name': {
    en: 'Name',
    te: 'పేరు',
  },
  'table.trade': {
    en: 'Trade',
    te: 'ట్రేడ్',
  },
  'table.institute': {
    en: 'Institute',
    te: 'సంస్థ',
  },
  'table.status': {
    en: 'Status',
    te: 'స్థితి',
  },
  'table.attendance': {
    en: 'Attendance',
    te: 'హాజరు',
  },
  'table.engagement': {
    en: 'Engagement',
    te: 'నిశ్చితార్థం',
  },
  'table.actions': {
    en: 'Actions',
    te: 'చర్యలు',
  },
  'table.date': {
    en: 'Date',
    te: 'తేదీ',
  },
  'table.checkIn': {
    en: 'Check In',
    te: 'చెక్ ఇన్',
  },
  'table.checkOut': {
    en: 'Check Out',
    te: 'చెక్ అవుట్',
  },

  // Status
  'status.present': {
    en: 'Present',
    te: 'హాజరు',
  },
  'status.absent': {
    en: 'Absent',
    te: 'గైర్హాజరు',
  },
  'status.late': {
    en: 'Late',
    te: 'ఆలస్యం',
  },
  'status.halfDay': {
    en: 'Half Day',
    te: 'అర్ధ రోజు',
  },
  'status.active': {
    en: 'Active',
    te: 'యాక్టివ్',
  },
  'status.inactive': {
    en: 'Inactive',
    te: 'ఇన్‌యాక్టివ్',
  },

  // Alerts
  'alert.severity.high': {
    en: 'High',
    te: 'అధికం',
  },
  'alert.severity.medium': {
    en: 'Medium',
    te: 'మధ్యస్థం',
  },
  'alert.severity.low': {
    en: 'Low',
    te: 'తక్కువ',
  },
  'alert.status.new': {
    en: 'New',
    te: 'కొత్త',
  },
  'alert.status.acknowledged': {
    en: 'Acknowledged',
    te: 'అంగీకరించబడింది',
  },
  'alert.status.resolved': {
    en: 'Resolved',
    te: 'పరిష్కరించబడింది',
  },
  'alert.type.lateArrival': {
    en: 'Late Arrival',
    te: 'ఆలస్య రాక',
  },
  'alert.type.frequentAbsence': {
    en: 'Frequent Absence',
    te: 'తరచుగా గైర్హాజరు',
  },
  'alert.type.lowEngagement': {
    en: 'Low Engagement',
    te: 'తక్కువ నిశ్చితార్థం',
  },
  'alert.type.negativeFeedback': {
    en: 'Negative Feedback',
    te: 'ప్రతికూల అభిప్రాయం',
  },
  'alert.aiExplanation': {
    en: 'AI Analysis',
    te: 'AI విశ్లేషణ',
  },

  // Feedback
  'feedback.title': {
    en: 'Student Feedback Form',
    te: 'విద్యార్థి అభిప్రాయ ఫారం',
  },
  'feedback.selectFaculty': {
    en: 'Select Faculty',
    te: 'ఫ్యాకల్టీని ఎంచుకోండి',
  },
  'feedback.rating': {
    en: 'Rating',
    te: 'రేటింగ్',
  },
  'feedback.comments': {
    en: 'Your Comments',
    te: 'మీ వ్యాఖ్యలు',
  },
  'feedback.submit': {
    en: 'Submit Feedback',
    te: 'అభిప్రాయాన్ని సమర్పించండి',
  },
  'feedback.anonymous': {
    en: 'Submit Anonymously',
    te: 'అనామకంగా సమర్పించండి',
  },
  'feedback.positive': {
    en: 'Positive',
    te: 'సానుకూలం',
  },
  'feedback.negative': {
    en: 'Negative',
    te: 'ప్రతికూలం',
  },
  'feedback.neutral': {
    en: 'Neutral',
    te: 'తటస్థం',
  },

  // Common
  'common.view': {
    en: 'View',
    te: 'వీక్షించండి',
  },
  'common.edit': {
    en: 'Edit',
    te: 'సవరించండి',
  },
  'common.delete': {
    en: 'Delete',
    te: 'తొలగించండి',
  },
  'common.search': {
    en: 'Search',
    te: 'శోధించండి',
  },
  'common.filter': {
    en: 'Filter',
    te: 'ఫిల్టర్',
  },
  'common.export': {
    en: 'Export',
    te: 'ఎక్స్‌పోర్ట్',
  },
  'common.today': {
    en: 'Today',
    te: 'ఈ రోజు',
  },
  'common.thisWeek': {
    en: 'This Week',
    te: 'ఈ వారం',
  },
  'common.thisMonth': {
    en: 'This Month',
    te: 'ఈ నెల',
  },
  'common.welcome': {
    en: 'Welcome',
    te: 'స్వాగతం',
  },
  'common.loading': {
    en: 'Loading...',
    te: 'లోడ్ అవుతోంది...',
  },
  'common.noData': {
    en: 'No data available',
    te: 'డేటా అందుబాటులో లేదు',
  },
  'common.all': {
    en: 'All',
    te: 'అన్నీ',
  },

  // Dashboard sections
  'dashboard.instituteRanking': {
    en: 'Institute Ranking',
    te: 'సంస్థ ర్యాంకింగ్',
  },
  'dashboard.recentAlerts': {
    en: 'Recent Alerts',
    te: 'ఇటీవలి హెచ్చరికలు',
  },
  'dashboard.attendanceTrend': {
    en: 'Attendance Trend',
    te: 'హాజరు ట్రెండ్',
  },
  'dashboard.engagementOverview': {
    en: 'Engagement Overview',
    te: 'నిశ్చితార్థ అవలోకనం',
  },
  'dashboard.facultyStatus': {
    en: 'Faculty Status',
    te: 'ఫ్యాకల్టీ స్థితి',
  },
  'dashboard.todaysSessions': {
    en: "Today's Sessions",
    te: 'నేటి సెషన్‌లు',
  },
  'dashboard.feedbackSummary': {
    en: 'Feedback Summary',
    te: 'అభిప్రాయ సారాంశం',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isTeluguActive: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const translation = translations[key];
      if (!translation) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
      return translation[language];
    },
    [language]
  );

  React.useEffect(() => {
    const saved = localStorage.getItem('preferred-language') as Language | null;
    if (saved && (saved === 'en' || saved === 'te')) {
      setLanguageState(saved);
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isTeluguActive: language === 'te',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
