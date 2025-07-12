import type { AppProps } from 'next/app';
import '../styles/globals.css';   // ← alias entfernt

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
