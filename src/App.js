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

const isHolidayPopupWindow = (date) => {
  const year = date.getFullYear();
  const startThisYear = new Date(year, 11, 20, 0, 0, 0, 0);
  const endNextYear = new Date(year + 1, 0, 6, 23, 59, 59, 999);
  const startPrevYear = new Date(year - 1, 11, 20, 0, 0, 0, 0);
  const endThisYear = new Date(year, 0, 6, 23, 59, 59, 999);

  return (
    (date >= startThisYear && date <= endNextYear) ||
    (date >= startPrevYear && date <= endThisYear)
  );
};

export default function App(){
  const location = useLocation();
  const popupShownRef = useRef(false);
  const isHolidayWindow = isHolidayPopupWindow(new Date());
  const [showTree, setShowTree] = useState(false);
  const homeSeo = {
    title: 'Studio Scarimbolo | Consulenza fiscale e aziendale a Bari',
    description: 'Studio professionale di consulenza fiscale, societaria e aziendale a Bari. Assistenza a imprese e professionisti.',
    url: 'https://www.studioscarimbolo.it/',
    image: 'https://www.studioscarimbolo.it/assets/home_about.jpg',
    type: 'website'
  };

  useEffect(() => {
    if (location.pathname !== '/') {
      return;
    }
    if (!isHolidayWindow) {
      return;
    }
    if (popupShownRef.current) {
      return;
    }

    popupShownRef.current = true;
    setShowTree(false);
    Popup.create({
      title: 'Buone feste!',
      content: (
        <div className='popupcontainer'>
          <img src="/assets/Buon_Natale.png" alt="Buone feste" />
        </div>
      ),
      buttons: {
        right: ['ok']
      }
    });
  }, [location.pathname, isHolidayWindow]);

  useEffect(() => {
    const handleClose = () => {
      if (isHolidayWindow && location.pathname === '/') {
        setShowTree(true);
      }
    };

    Popup.addCloseListener(handleClose);
    return () => Popup.removeCloseListener(handleClose);
  }, [isHolidayWindow, location.pathname]);

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
      {isHolidayWindow && location.pathname === '/' && showTree && (
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
