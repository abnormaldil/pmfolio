import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ServicesPage() {
  const supabase = createSupabaseServerClient();

  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .order("id", { ascending: true }); // optional

  if (error) {
    console.error("Supabase error:", error);
    return <div>Failed to load services</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Services</h1>

      <pre className="bg-zinc-900 text-zinc-100 p-4 rounded">
        {JSON.stringify(services, null, 2)}
      </pre>
    </div>
  );
}
