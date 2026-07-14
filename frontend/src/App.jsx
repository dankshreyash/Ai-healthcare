/**
 * Root application component.
 * Sets up MUI theme, React Router, and the main layout.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';

import theme from './theme';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import LogInteractionPage from './pages/LogInteractionPage';
import HistoryPage from './pages/HistoryPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/log" element={<LogInteractionPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#1A2332',
            color: '#fff',
            fontSize: '0.875rem',
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;
