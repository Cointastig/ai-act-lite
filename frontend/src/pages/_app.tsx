import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import "../styles/globals.css";   // lokale Tailwind-Direktiven (@tailwind …)

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Head-Block: Manifest + Tailwind-CDN-Fallback */}
      <Head>
        {/* PWA-Manifest (404 verschwindet) */}
        <link rel="manifest" href="/manifest.json" />

        {/* Tailwind 3.x – funktionierender CDN-Pfad */}
        <link
          href="https://unpkg.com/tailwindcss@3.4.4/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>

      {/* Brand-Header mit Logo */}
      <header className="bg-brand-400 px-6 py-3">
        <Link href="/" className="inline-block">
          {/* Falls Next-Image Probleme macht, gern durch <img …> ersetzen */}
          <Image
            src="/logo.png"
            alt="AI-Act Lite"
            width={140}
            height={32}
            priority
          />
        </Link>
      </header>

      {/* Seiteninhalt */}
      <Component {...pageProps} />
    </>
  );
}
