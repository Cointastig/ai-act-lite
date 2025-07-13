import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import "../../public/style.css";        // festen Style laden

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <title>AI-Act Lite – Risikoassistent</title>
      </Head>

      {/* Brand-Header */}
      <header className="px-6 py-3">
        <Link href="/" className="inline-block">
          <Image src="/logo.png" alt="AI-Act Lite" width={140} height={32} priority />
        </Link>
      </header>

      {/* Seiteninhalt */}
      <Component {...pageProps} />

      {/* Footer mit EU-AI-Act-Link */}
      <footer className="footer">
        Mehr zum Gesetz&nbsp;
        <a
          href="https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A52021PC0206"
          target="_blank"
          rel="noopener noreferrer"
        >
          EU AI Act (Entwurfsfassung)
        </a>
      </footer>
    </>
  );
}
