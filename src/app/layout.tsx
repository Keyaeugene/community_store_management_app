import './globals.css'; // Import global styles (e.g., Tailwind CSS)
import { ReactNode } from 'react';

export const metadata = {
  title: 'Community Store Management',
  description: 'Manage community store operations, members, and inventory',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
