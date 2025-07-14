// frontend/src/pages/_app.tsx

import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import {
  SessionContextProvider,
  Session,
} from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

import "../../public/style.css";

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session }>) {
  // Supabase-Client erst im Browser erzeugen
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  useEffect(() => {
    setSupabaseClient(createPagesBrowserClient());
  }, []);

  // Bis dahin nichts rendern
  if (!supabaseClient) {
    return null;
  }

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Head>
        <title>AI-Act Lite</title>
      </Head>

      {/* HEADER */}
      <header className="px-6 py-3 bg-brand-400 flex items-center justify-between">
        <Link href="/" className="inline-block">
          <Image
            src="/logo.png"
            alt="AI-Act Lite"
            width={140}
            height={32}
            priority
          />
        </Link>
        <AuthStatus />
      </header>

      {/* PAGE CONTENT */}
      <Component {...pageProps} />

      {/* FOOTER */}
      <footer className="footer">
        Mehr zum Gesetz{" "}
        <a
          href="https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A52021PC0206"
          target="_blank"
          rel="noopener noreferrer"
        >
          EU AI Act (Entwurfsfassung)
        </a>
      </footer>
    </SessionContextProvider>
  );
}

// ——— kleines Login/Logout-UI (inkl. Dashboard-Link) ———
function AuthStatus() {
  const { session, supabaseClient } = useStateContext();

  if (!session) {
    return <Link href="/login" className="text-white">Login</Link>;
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/dashboard" className="text-white">
        Dashboard
      </Link>
      <button
        className="text-white text-sm"
        onClick={() => supabaseClient.auth.signOut()}
      >
        Logout ({session.user.email})
      </button>
    </div>
  );
}

// Helfer: useSessionContext via dynamischen Import (vermeidet Server-Build-Errors)
function useStateContext() {
  const { useSessionContext } = require("@supabase/auth-helpers-react");
  return useSessionContext();
}
