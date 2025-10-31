"use client";

import { ExperienceType, TimeSlotType } from "@/types/types";
import Image from "next/image";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ExperienceDetailPage({
  experience,
  timeSlots,
}: {
  experience: ExperienceType;
  timeSlots: TimeSlotType[];
}) {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Group timeslots by date
  const groupedByDate = timeSlots.reduce((acc, slot) => {
    const date = new Date(slot.dateTime).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlotType[]>);

  const dates = Object.keys(groupedByDate);
  // Pick the date to use: selectedDate OR first one
  const dateToUse = selectedDate || dates[0];

  // Pick the available times for that date
  const availableTimes = dateToUse ? groupedByDate[dateToUse] : [];
  // const availableTimes = selectedDate ? groupedByDate[selectedDate] : [];

  const selectedSlot = timeSlots.find((slot) => slot.id === selectedTimeSlot);
  const subtotal = experience.price * quantity;
  // Tax it at 18% because im pretty sure those are the real rates
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + taxes;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && selectedSlot) {
      const available = selectedSlot.capacity - selectedSlot.bookedCount;
      if (newQuantity <= available) {
        setQuantity(newQuantity);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4">
        <Link href="/" className="flex items-center gap-4 pb-4">
          <ArrowLeft className="h-4 w-4" />
          Details
        </Link>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/5 space-y-6">
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
              <Image src={experience.images[0]} alt={experience.name} fill className="object-cover" />
            </div>

            <div className="bg-white rounded-lg p-6 space-y-4">
              <h1 className="text-3xl font-bold">{experience.name}</h1>
              <p className="text-gray-600">{experience.description}</p>

              <div className="space-y-3">
                <h2 className="font-semibold text-lg">Choose date</h2>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {dates.map((date) => (
                    <Button
                      key={date}
                      variant={selectedDate === date ? "default" : "outline"}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTimeSlot(null);
                      }}
                      className={
                        selectedDate === date ? "bg-yellow-400 hover:bg-yellow-500 text-black" : "text-gray-500"
                      }
                    >
                      {date}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="font-semibold text-lg">Choose time</h2>
                <div className="flex gap-2 flex-wrap">
                  {availableTimes.map((slot) => {
                    const time = new Date(slot.dateTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                    const available = slot.capacity - slot.bookedCount;
                    const isSelected = selectedTimeSlot === slot.id;

                    return (
                      <Button
                        key={slot.id}
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => {
                          setSelectedTimeSlot(slot.id);
                          setQuantity(1);
                        }}
                        disabled={available === 0}
                        className={
                          isSelected ? "bg-yellow-400 hover:bg-yellow-500 text-black relative" : "text-gray-500"
                        }
                      >
                        {time}
                        {available < 5 && available > 0 && (
                          <div className="text-xs text-red-500 font-semibold">{available} left</div>
                        )}
                        {available === 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Sold out
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-500">All times are in IST (GMT +5:30)</p>
              </div>

              {experience.about && (
                <div className="space-y-2">
                  <h2 className="font-semibold text-lg">About</h2>
                  <p className="text-gray-600 text-sm">{experience.about}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-2/5">
            <Card className="p-6 sticky top-6 space-y-2">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Starts at</span>
                  <span className="font-semibold">₹{experience.price}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quantity</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(1)}
                      disabled={!selectedSlot || quantity >= selectedSlot.capacity - selectedSlot.bookedCount}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-semibold">₹{taxes}</span>
                </div>

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg">₹{total}</span>
                </div>
              </div>

              <Button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                disabled={!selectedTimeSlot}
                onClick={() => {
                  if (selectedTimeSlot) {
                    router.push(
                      `/checkout?experienceId=${experience.id}&timeSlotId=${selectedTimeSlot}&quantity=${quantity}`
                    );
                  }
                }}
              >
                {!selectedTimeSlot ? "Select a date and time slot" : "Confirm"}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
