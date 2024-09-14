import './globals.css'
import { NotificationProvider } from '../components/NotificationContext';
import { ConfirmationProvider } from '../components/ConfirmationContext';
import Notification from '../components/Notification';
import Confirmation from '../components/Confirmation';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          <ConfirmationProvider>
            {children}
            <Notification />
            <Confirmation />
          </ConfirmationProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
