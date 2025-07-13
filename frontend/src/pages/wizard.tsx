import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import RiskWizardForm from "../components/RiskWizardForm";

export default function WizardPage() {
  const { session, isLoading } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) router.replace("/login");
  }, [isLoading, session, router]);

  if (!session) return null;          // optional: Spinner

  return <RiskWizardForm />;
}
