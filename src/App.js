import './App.css';
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
import SocialStrip from './components/SocialStrip';
import { Routes, Route } from 'react-router-dom';
import ServicesPage from './pages/ServicesPage';
import ServiceDetail from './pages/ServiceDetail';
import NewsPage from './pages/NewsPage';
import NewsDetail from './pages/NewsDetail';
import AboutPage from './pages/AboutPage';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Privacy from './pages/Privacy';
import AdminPage from './pages/AdminPage';
import ScrollToTop from './components/script/ScrollToTop';

export default function App(){
  return (
    <I18nProvider>
      <ScrollToTop behavior='smooth'/>

      <Header />
      <main>
        <Routes>
          <Route path="/" element={
            <>
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
          <Route path="/chi-siamo" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      <Contact/>
      <SocialStrip />

      <Footer />
    </I18nProvider>
  );
}
