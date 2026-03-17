import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function InstrumentsData() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("instruments")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
    return <div>Error loading instruments</div>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default function Instruments() {
  return (
    <Suspense fallback={<div>Loading instruments...</div>}>
      <InstrumentsData />
    </Suspense>
  );
}
