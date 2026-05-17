import { I18nProvider } from './i18n';
import Header from './components/Header';
import Hero from './components/Hero';
import Welcome from './components/Welcome';
import Services from './components/Services';
import News from './components/News';
import Works from './components/Works';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatAssistant from './components/ChatAssistant';
import SocialStrip from './components/SocialStrip';
import Seo from './components/Seo';
import { Routes, Route, useLocation } from 'react-router-dom';
import ServicesPage from './pages/ServicesPage';
import ServiceDetail from './pages/ServiceDetail';
import NewsPage from './pages/NewsPage';
import NewsDetail from './pages/NewsDetail';
import AboutPage from './pages/AboutPage';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Privacy from './pages/Privacy';
import ActivitiesPage from './pages/ActivitiesPage';
import AdminPage from './pages/AdminPage';
import ScrollToTop from './components/script/ScrollToTop';
import DeadlinesDetail from './pages/DeadlinesDetail';
import React, { useEffect, useRef, useState } from 'react';
import XmasTree from 'react-xmas-tree/react';
import Popup from 'react-popup';
import 'react-popup/style.css';
import './App.css';
import siteSettings from './content/siteSettings.json';
import popupContent from './content/popups.json';
import { getCmsPreviewData } from './content/cmsPreview';

const parseMonthDay = (value) => {
  if (!value || typeof value !== 'string') return null;
  const normalized = value.trim();
  const fullDateMatch = normalized.match(/^\d{4}-(\d{2})-(\d{2})$/);
  const dayMonthMatch = normalized.match(/^(\d{2})\/(\d{2})$/);
  const day = fullDateMatch ? Number(fullDateMatch[2]) : dayMonthMatch ? Number(dayMonthMatch[1]) : null;
  const month = fullDateMatch ? Number(fullDateMatch[1]) : dayMonthMatch ? Number(dayMonthMatch[2]) : null;
  if (!day || !month || day < 1 || day > 31 || month < 1 || month > 12) return null;
  return month * 100 + day;
};

const popupIsActive = (popup, date = new Date()) => {
  if (!popup?.enabled) return false;
  const start = parseMonthDay(popup.startDay || popup.startDate);
  const end = parseMonthDay(popup.endDay || popup.endDate);
  const today = (date.getMonth() + 1) * 100 + date.getDate();
  if (start && end && start > end) {
    return today >= start || today <= end;
  }
  if (start && today < start) return false;
  if (end && today > end) return false;
  return true;
};

const popupHasEffect = (popup, effect) => {
  return Array.isArray(popup?.effects) && popup.effects.includes(effect);
};

export default function App(){
  const location = useLocation();
  const popupShownRef = useRef(false);
  const previewPopupContent = getCmsPreviewData('popup_notices', 'it', popupContent);
  const popupList = Array.isArray(previewPopupContent?.popups) ? previewPopupContent.popups : [];
  const isPopupPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('cms-preview') === 'popup_notices';
  const activePopup = isPopupPreview
    ? popupList.find((popup) => popup?.enabled) || popupList[0]
    : popupList.find((popup) => popupIsActive(popup));
  const [showTree, setShowTree] = useState(false);
  const homeSeo = siteSettings.seo.home;

  useEffect(() => {
    if (location.pathname !== '/') {
      return;
    }
    if (!activePopup) {
      return;
    }
    if (popupShownRef.current === activePopup.id) {
      return;
    }

    popupShownRef.current = activePopup.id;
    setShowTree(false);
    document.body.dataset.popupEffects = (activePopup.effects || []).join(' ');
    Popup.create({
      title: activePopup.title,
      content: (
        <div className="popupcontainer">
          {activePopup.image && <img src={activePopup.image} alt={activePopup.title} />}
          {activePopup.text && <p>{activePopup.text}</p>}
        </div>
      ),
      buttons: {
        right: [{
          text: activePopup.buttonLabel || 'Chiudi',
          action: (store) => store.close()
        }]
      }
    });
  }, [location.pathname, activePopup]);

  useEffect(() => {
    const handleClose = () => {
      document.body.dataset.popupEffects = '';
      if (activePopup && popupHasEffect(activePopup, 'christmas_tree') && location.pathname === '/') {
        setShowTree(true);
      }
    };

    Popup.addCloseListener(handleClose);
    return () => Popup.removeCloseListener(handleClose);
  }, [activePopup, location.pathname]);

  return (
    <I18nProvider>
      <ScrollToTop behavior='smooth'/>

      <Header />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Seo {...homeSeo} />
              <Hero />
              <Welcome />
              <Services />
              <News />
              <About />
            </>
          }/>
          <Route path="/servizi" element={<ServicesPage />} />
          <Route path="/servizi/:slug" element={<ServiceDetail />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/scadenze/:slug" element={<DeadlinesDetail />} />
          <Route path="/chi-siamo" element={<AboutPage />} />
          <Route path="/aree-di-attivita" element={<ActivitiesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      <Contact/>
      <SocialStrip />
      <ChatAssistant />
      <Popup defaultOk="Chiudi" />
      {activePopup && popupHasEffect(activePopup, 'christmas_tree') && location.pathname === '/' && showTree && (
        <XmasTree lightColors={[
          "#ff0000", // Red
          "#00ff00", // Green
          "#0000ff", // Blue
          "#ff00ff"  // Magenta
        ]} />
      )}
      <Footer />
    </I18nProvider>
  );
  
}
