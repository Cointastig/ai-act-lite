import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import "../styles/globals.css";          // bindet das lokal gebaute Tailwind-CSS ein

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Manifest – kann bleiben, verursacht keinen 404 mehr */}
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>

      {/* Brand-Header mit Logo */}
      <header className="bg-brand-400 px-6 py-3">
        <Link href="/" className="inline-block">
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
