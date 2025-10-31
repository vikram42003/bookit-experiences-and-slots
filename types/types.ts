export type ExperienceType = {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  location: string;
  about?: string;
  createdAt: string;
  updatedAt: string;
};

export type TimeSlotType = {
  id: string;
  dateTime: string;
  capacity: number;
  bookedCount: number;
  createdAt: string;
  updatedAt: string;
};

export type BookingType = {
  id: string;
  timeSlot: string;
  experience: string;
  userName: string;
  userEmail: string;
  quantity: number;
  promoCode?: string;
  finalPrice: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingType = Omit<BookingType, "id" | "createdAt" | "updatedAt">;
