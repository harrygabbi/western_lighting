import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

type Props = { children: ReactNode };

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
