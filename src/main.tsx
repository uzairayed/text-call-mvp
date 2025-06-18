import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SessionProvider } from './SessionContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SessionProvider>
    <App />
  </SessionProvider>
)
