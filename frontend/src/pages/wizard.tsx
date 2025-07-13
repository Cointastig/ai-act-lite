import Head from "next/head";
import RiskWizardForm from "../components/RiskWizardForm";

export default function WizardPage() {
  return (
    <>
      <Head>
        <title>AI-Act Lite – Risikoassistent</title>
      </Head>

      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="mb-6 text-2xl font-bold">AI-Act Risikoassistent</h1>

          <RiskWizardForm />
        </div>
      </main>
    </>
  );
}
