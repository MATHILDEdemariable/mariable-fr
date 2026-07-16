import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'

// Reload once when a dynamic import fails (stale chunk after new deploy)
const handleChunkError = (message: string) => {
  if (!/Failed to fetch dynamically imported module|Importing a module script failed/i.test(message)) return;
  const key = 'chunk-reload-attempt';
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, '1');
  window.location.reload();
};

window.addEventListener('error', (e) => {
  handleChunkError(e.message || '');
});
window.addEventListener('unhandledrejection', (e) => {
  const msg = e.reason?.message || String(e.reason || '');
  handleChunkError(msg);
});

createRoot(document.getElementById("root")!).render(<App />);
