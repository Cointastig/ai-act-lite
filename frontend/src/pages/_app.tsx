// frontend/src/pages/_app.tsx

import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  SessionContextProvider,
  SessionContextProviderProps,
} from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{ initialSession: any }>) {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient()
  );

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Head>
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <header className="header">
        <Link href="/">
          <Image src="/logo.png" alt="AI-Act Lite" width={120} height={32} />
        </Link>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/wizard">Risiko-Assistent</Link>
          <Link href="/pricing">Preise</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
      </header>
      <main className="main">
        <Component {...pageProps} />
      </main>
    </SessionContextProvider>
  );
}
