import type { Metadata } from 'next';
import '@/src/index.css';
import Shell from './Shell';

export const metadata: Metadata = {
  title: 'Rakshit Sharma | Portfolio',
  description: 'Rakshit Sharma',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
