import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { GreetingPage } from '@/pages/GreetingPage';
import { ModelPage } from '@/pages/ModelPage';
import { AdminPanel } from '@/pages/AdminPanel';
import { RegulationsPage } from '@/pages/RegulationsPage';
import { RegulationDetailPage } from '@/pages/RegulationDetailPage';
import { NewsPage } from '@/pages/NewsPage';
import { NewsDetailPage } from '@/pages/NewsDetailPage';

/**
 * Главный компонент приложения с роутингом
 */
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<GreetingPage />} />
          <Route path="/model/:id" element={<ModelPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/regulations" element={<RegulationsPage />} />
          <Route path="/regulations/:id" element={<RegulationDetailPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
