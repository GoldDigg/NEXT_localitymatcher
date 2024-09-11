import '../styles/globals.css'
// Ta bort eller kommentera ut följande rad:
// import '../src/components/CompanyModal.css'

import { ConfirmationProvider } from '../components/ConfirmationContext';
import { NotificationProvider } from '../components/NotificationContext';
import Confirmation from '../components/Confirmation';

function MyApp({ Component, pageProps }) {
  return (
    <ConfirmationProvider>
      <NotificationProvider>
        <Component {...pageProps} />
        <Confirmation />
      </NotificationProvider>
    </ConfirmationProvider>
  );
}

export default MyApp
