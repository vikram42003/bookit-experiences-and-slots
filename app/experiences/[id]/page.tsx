import { API_URL } from "@/lib/config";
import { ExperienceType, TimeSlotType } from "@/types/types";
import ExperienceDetailPage from "@/components/ExperienceDetails";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const res = await fetch(API_URL + "/experiences/" + id);
  const { experience, timeSlots }: { experience: ExperienceType; timeSlots: TimeSlotType[] } = await res.json();

  return <ExperienceDetailPage experience={experience} timeSlots={timeSlots} />;
};

export default page;
