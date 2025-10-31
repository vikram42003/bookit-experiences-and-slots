import ExperienceCards from "@/components/ExperiencesCards";

export default async function RootPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
  }>;
}) {
  const query = (await searchParams)?.q || "";

  return (
    <main className="layout-container">
      <ExperienceCards query={query} />
    </main>
  );
}
