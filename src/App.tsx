import { NuqsAdapter } from 'nuqs/adapters/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Document from './pages/Document';
import Government from './pages/Government';
import Barangays from './pages/Barangays';
import Transparency from './pages/Transparency';
import Hotlines from './pages/Hotlines';
import Search from './pages/Search';
import { isMeilisearchEnabled } from './lib/meilisearch';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <NuqsAdapter>
          <div className="min-h-screen flex flex-col">
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <Navbar />
            <ScrollToTop />
            <div id="main-content" className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:category" element={<Services />} />
                <Route
                  path="/services/:category/:documentSlug"
                  element={<Document categoryType="service" />}
                />
                <Route path="/government" element={<Government />} />
                <Route path="/barangays" element={<Barangays />} />
                <Route path="/transparency" element={<Transparency />} />
                <Route path="/hotlines" element={<Hotlines />} />
                {isMeilisearchEnabled && <Route path="/search" element={<Search />} />}
              </Routes>
            </div>
            <Footer />
          </div>
        </NuqsAdapter>
      </Router>
    </HelmetProvider>
  );
}

export default App;
