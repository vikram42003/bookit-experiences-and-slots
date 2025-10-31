import { API_URL } from "@/lib/config";
import { ExperienceType } from "@/types/types";
import Link from "next/link";

const ExperienceCard = ({ card }: { card: ExperienceType }) => {
  return (
    <div className="bg-gray-100 rounded-md overflow-hidden flex flex-col h-48 md:h-80">
      <div className="flex-1/2 overflow-hidden">
        <img src={card.images[0]} alt={`Image of ${card.location}`} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1/2 py-3 px-4 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-lg text-ellipsis">{card.name}</span>
          <span className="text-sm bg-gray-300 rounded px-2 py-1">{card.location}</span>
        </div>

        <p className="text-[0.85vw] text-gray-700 line-clamp-3 text-ellipsis">{card.description}</p>

        <div className="flex items-center justify-between">
          <p className="flex items-center">
            <span className="text-sm">From </span>

            <span className="font-semibold text-lg ml-1"> ₹{card.price}</span>
          </p>
          <Link href={`/experiences/${card.id}`} className="p-2 text-sm font-medium bg-yellow-400 rounded">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const ExperienceCards = async ({ query }: { query: string }) => {
  const res = await fetch(API_URL + "/experiences", { next: { revalidate: 180 } });
  const cards: ExperienceType[] = await res.json();

  const filteredCards = cards.filter(
    (card: ExperienceType) =>
      card.name.toLowerCase().includes(query.toLowerCase()) || card.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
      {filteredCards.length === 0
        ? `No experiences found for "${query}"`
        : filteredCards.map((card: ExperienceType) => <ExperienceCard key={card.id} card={card} />)}
    </div>
  );
};

export default ExperienceCards;
