import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Actually Shadcn toast requires Toaster. I'll leave it out for now to avoid error if not installed.
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import IssueDetailsPage from './pages/IssueDetailsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/issues/:id" element={<IssueDetailsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
