import './globals.css'
import { NotificationProvider } from '../components/NotificationContext';
import Notification from '../components/Notification';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          {children}
          <Notification />
        </NotificationProvider>
      </body>
    </html>
  );
}
