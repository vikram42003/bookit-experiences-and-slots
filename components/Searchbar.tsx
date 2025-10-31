"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const Searchbar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const query = formData.get("q") as string;

    const search = new URLSearchParams(searchParams.toString());
    if (query) {
      search.set("q", query);
    } else {
      search.delete("q");
    }

    replace(`${pathname}?${search.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-4">
      <input
        type="text"
        name="q"
        defaultValue={searchParams.get("q") || ""}
        placeholder="Search experiences"
        className="border px-2 py-1 rounded-md bg-gray-200 lg:min-w-[20vw]"
      />
      <button type="submit" className="bg-yellow-400 text-black px-4 py-2 rounded-md">
        Search
      </button>
    </form>
  );
};

export default Searchbar;
