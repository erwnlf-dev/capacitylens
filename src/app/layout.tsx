// FILE: src/app/layout.tsx
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CapacityLens',
  description: 'Monitor dan ramalkan kapasitas dengan mudah untuk cloud hibrid Anda.',
  openGraph: {
    title: 'CapacityLens',
    description: 'Monitor dan ramalkan kapasitas dengan mudah untuk cloud hibrid Anda.',
    url: 'https://capacitylens.com',
    siteName: 'CapacityLens',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CapacityLens',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'Monitor dan ramalkan kapasitas dengan mudah untuk cloud hibrid Anda.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.className} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-page)] text-[var(--text)]">
        {children}
        <details className="fixed bottom-4 right-4">
          <summary className="btn btn-primary cursor-pointer">Bantuan</summary>
          <div className="mt-2 p-4 bg-slate-900 border border-slate-800 rounded-lg shadow-lg">
            <p className="text-xs text-slate-400">Hubungi dukungan jika ada pertanyaan.</p>
          </div>
        </details>
      </body>
    </html>
  );
}
