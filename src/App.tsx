import { NuqsAdapter } from 'nuqs/adapters/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Document from './pages/Document';
import Government from './pages/Government';
import Barangays from './pages/Barangays';
import BarangayProfile from './pages/BarangayProfile';
import Elections from './pages/Elections';
import OfficialProfile from './pages/OfficialProfile';
import Hotlines from './pages/Hotlines';
import CommunityTools from './pages/CommunityTools';
import ConcernFinder from './pages/ConcernFinder';
import GetInvolved from './pages/GetInvolved';
import ProjectsBudget from './pages/ProjectsBudget';
import Statistics from './pages/Statistics';
import Legislation from './pages/Legislation';
import News from './pages/News';
import Contact from './pages/Contact';
import VisitMakati from './pages/VisitMakati';
import Heritage from './pages/Heritage';
import History from './pages/History';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Mobility from './pages/Mobility';
import Cinemas from './pages/Cinemas';
import Estates from './pages/Estates';
import LiveMakati from './pages/LiveMakati';
import Parking from './pages/Parking';
import WhatsOn from './pages/WhatsOn';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import Accountability from './pages/Accountability';
import Participate from './pages/Participate';
import PublicRecords from './pages/PublicRecords';
import Today from './pages/Today';
import OpenGovernment from './pages/OpenGovernment';
import Integrity from './pages/Integrity';
import ProjectStatus from './pages/ProjectStatus';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <NuqsAdapter>
          <div className="min-h-screen flex flex-col">
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Navbar />
            <ScrollToTop />
            <main id="main-content" className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                <Route path="/services" element={<Services />} />
                <Route path="/services/:category" element={<Services />} />
                <Route
                  path="/services/:category/:documentSlug"
                  element={<Document categoryType="service" />}
                />

                <Route path="/visit" element={<VisitMakati />} />
                <Route path="/mobility" element={<Mobility />} />
                <Route path="/cinemas" element={<Cinemas />} />
                <Route path="/parking" element={<Parking />} />
                <Route path="/whats-on" element={<WhatsOn />} />
                <Route path="/heritage" element={<Heritage />} />
                <Route path="/history" element={<History />} />

                <Route path="/government" element={<Government />} />
                <Route path="/accountability" element={<Accountability />} />
                <Route path="/records" element={<PublicRecords />} />
                <Route path="/participate" element={<Participate />} />
                <Route path="/today" element={<Today />} />
                <Route path="/open-government" element={<OpenGovernment />} />
                <Route path="/integrity" element={<Integrity />} />
                <Route path="/status" element={<ProjectStatus />} />
                <Route path="/barangays" element={<Barangays />} />
                <Route path="/barangays/:slug" element={<BarangayProfile />} />
                <Route path="/elections" element={<Elections />} />
                <Route path="/officials/:slug" element={<OfficialProfile />} />
                <Route path="/estates" element={<Estates />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/legislation" element={<Legislation />} />
                <Route path="/news" element={<News />} />
                <Route path="/live" element={<LiveMakati />} />

                <Route path="/projects-budget" element={<ProjectsBudget />} />
                <Route
                  path="/transparency"
                  element={<Navigate to="/projects-budget" replace />}
                />

                <Route path="/community-tools" element={<CommunityTools />} />
                <Route
                  path="/community-tools/saan-ako-lalapit"
                  element={<ConcernFinder />}
                />

                <Route path="/search" element={<Search />} />
                <Route path="/get-involved" element={<GetInvolved />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/hotlines" element={<Hotlines />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </NuqsAdapter>
      </Router>
    </HelmetProvider>
  );
}

export default App;
