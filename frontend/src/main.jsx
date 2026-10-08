import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import axios from 'axios'

// Set the base URL for all axios requests.
// This ensures that in production (Vercel), requests go to the Render backend 
// instead of trying to request from Vercel's domain.
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Strip out '/api' if it was included in the environment variable, 
// because all frontend axios calls already start with '/api/...'
axios.defaults.baseURL = apiUrl.replace(/\/api\/?$/, '');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
