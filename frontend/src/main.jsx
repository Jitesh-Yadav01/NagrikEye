import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import AuthContext from './context/AuthContext';
import App from './App';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
     <AuthContext>
      <App />
     </AuthContext>
    </BrowserRouter>
)
