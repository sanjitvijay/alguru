import {createRoot} from 'react-dom/client';
import App from './components/App';
import './styles.css';
import { AppContextProvider } from './context/AppContext';
import { AIProvider } from './context/AIContext';


const root = createRoot(document.getElementById('root'));
root.render(
    <AIProvider>     
    <AppContextProvider>
        <App />
    </AppContextProvider>
    </AIProvider>
);