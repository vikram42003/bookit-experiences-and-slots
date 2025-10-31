import ExperienceCards from "@/components/ExperiencesCards";
import { API_URL } from "@/lib/config";

export default async function RootPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
  }>;
}) {
  const query = (await searchParams)?.q || "";
  fetch(API_URL + "/health");

  return (
    <main className="layout-container">
      <ExperienceCards query={query} />
    </main>
  );
}
