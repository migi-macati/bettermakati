import PageHelp from './components/ui/PageHelp';
import { lazy, Suspense } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import PageBoundary from './components/ui/PageBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import Home from './pages/Home';
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Document = lazy(() => import('./pages/Document'));
const ServiceGuide = lazy(() => import('./pages/ServiceGuide'));
const GovernmentOffices = lazy(() => import('./pages/GovernmentOffices'));
const Government = lazy(() => import('./pages/Government'));
const Barangays = lazy(() => import('./pages/Barangays'));
const BarangayProfile = lazy(() => import('./pages/BarangayProfile'));
const Elections = lazy(() => import('./pages/Elections'));
const OfficialProfile = lazy(() => import('./pages/OfficialProfile'));
const Hotlines = lazy(() => import('./pages/Hotlines'));
const CommunityTools = lazy(() => import('./pages/CommunityTools'));
const ConcernFinder = lazy(() => import('./pages/ConcernFinder'));
const GetInvolved = lazy(() => import('./pages/GetInvolved'));
const ProjectsBudget = lazy(() => import('./pages/ProjectsBudget'));
const Statistics = lazy(() => import('./pages/Statistics'));
const Legislation = lazy(() => import('./pages/Legislation'));
const News = lazy(() => import('./pages/News'));
const Contact = lazy(() => import('./pages/Contact'));
const VisitMakati = lazy(() => import('./pages/VisitMakati'));
const Heritage = lazy(() => import('./pages/Heritage'));
const History = lazy(() => import('./pages/History'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Mobility = lazy(() => import('./pages/Mobility'));
const Cinemas = lazy(() => import('./pages/Cinemas'));
const Estates = lazy(() => import('./pages/Estates'));
const LiveMakati = lazy(() => import('./pages/LiveMakati'));
const Parking = lazy(() => import('./pages/Parking'));
const WhatsOn = lazy(() => import('./pages/WhatsOn'));
const Search = lazy(() => import('./pages/Search'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Accountability = lazy(() => import('./pages/Accountability'));
const Participate = lazy(() => import('./pages/Participate'));
const PublicRecords = lazy(() => import('./pages/PublicRecords'));
const PublicRecordDetail = lazy(() => import('./pages/PublicRecordDetail'));
const Today = lazy(() => import('./pages/Today'));
const OpenGovernment = lazy(() => import('./pages/OpenGovernment'));
const Integrity = lazy(() => import('./pages/Integrity'));
const ProjectStatus = lazy(() => import('./pages/ProjectStatus'));
const CityMonitor = lazy(() => import('./pages/CityMonitor'));
const CivicBriefs = lazy(() => import('./pages/CivicBriefs'));
const CivicMap = lazy(() => import('./pages/CivicMap'));
const CivicNearbyReport = lazy(() => import('./pages/CivicNearbyReport'));
const CivicAsset = lazy(() => import('./pages/CivicAsset'));
const CivicReports = lazy(() => import('./pages/CivicReports'));
const CivicAuditPilot = lazy(() => import('./pages/CivicAuditPilot'));
const CivicAuditResults = lazy(() => import('./pages/CivicAuditResults'));
const Reports = lazy(() => import('./pages/Reports'));
const ReportArticle = lazy(() => import('./pages/ReportArticle'));
const CityMonitorRecordPage = lazy(
  () => import('./pages/CityMonitorRecordPage')
);

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
            <main id="main-content" tabIndex={-1} className="flex-grow">
              <PageBoundary>
                <Suspense
                  fallback={
                    <div className="container px-5 py-16" role="status">
                      <p className="text-primary-800 font-semibold">
                        Loading page…
                      </p>
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />

                    <Route path="/services" element={<Services />} />
                    <Route
                      path="/services/guide/:id"
                      element={<ServiceGuide />}
                    />
                    <Route
                      path="/government-offices"
                      element={<GovernmentOffices />}
                    />
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
                    <Route
                      path="/accountability"
                      element={<Accountability />}
                    />
                    <Route path="/records" element={<PublicRecords />} />
                    <Route path="/records/:id" element={<PublicRecordDetail />} />
                    <Route path="/participate" element={<Participate />} />
                    <Route path="/today" element={<Today />} />
                    <Route
                      path="/open-government"
                      element={<OpenGovernment />}
                    />
                    <Route path="/integrity" element={<Integrity />} />
                    <Route path="/status" element={<ProjectStatus />} />
                    <Route path="/city-monitor" element={<CityMonitor />} />
                    <Route
                      path="/city-monitor/:id"
                      element={<CityMonitorRecordPage />}
                    />
                    <Route path="/briefs" element={<CivicBriefs />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/reports/makati-overview" element={<Navigate to="/reports/2026-budget-operating-expenses" replace />} />
                    <Route path="/reports/:slug" element={<ReportArticle />} />
                    <Route path="/civic-map" element={<CivicMap />} />
                    <Route path="/civic-map/reports" element={<CivicReports />} />
                    <Route path="/civic-map/audits/park-accessibility-2026" element={<CivicAuditPilot />} />
                    <Route path="/civic-map/audits/park-accessibility-2026/results" element={<CivicAuditResults />} />
                    <Route path="/civic-map/report" element={<CivicNearbyReport />} />
                    <Route path="/civic-map/:assetId" element={<CivicAsset />} />
                    <Route path="/barangays" element={<Barangays />} />
                    <Route
                      path="/barangays/:slug"
                      element={<BarangayProfile />}
                    />
                    <Route path="/elections" element={<Elections />} />
                    <Route
                      path="/officials/:slug"
                      element={<OfficialProfile />}
                    />
                    <Route path="/estates" element={<Estates />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/legislation" element={<Legislation />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/live" element={<LiveMakati />} />

                    <Route
                      path="/projects-budget"
                      element={<ProjectsBudget />}
                    />
                    <Route
                      path="/transparency"
                      element={<Navigate to="/projects-budget" replace />}
                    />

                    <Route
                      path="/community-tools"
                      element={<CommunityTools />}
                    />
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
                  <ScrollToTop />
                </Suspense>
              </PageBoundary>
            </main>
            <PageHelp />
            <Footer />
          </div>
        </NuqsAdapter>
      </Router>
    </HelmetProvider>
  );
}

export default App;
