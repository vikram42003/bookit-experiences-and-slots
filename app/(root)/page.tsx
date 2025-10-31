import ExperienceCards from "@/components/ExperiencesCards";

const page = async ({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
  }>;
}) => {
  const query = (await searchParams)?.q || "";

  return (
    <main className="layout-container">
      <ExperienceCards query={query} />
    </main>
  );
};

export default page;
