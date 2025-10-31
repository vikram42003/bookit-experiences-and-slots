"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, CircleX } from "lucide-react";
import { API_URL } from "@/lib/config";
import LoadingComponent from "@/components/LoadingComponent";

export default function ResultPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [failed, setFailed] = useState<boolean>(true);
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  useEffect(() => {
    const verifyBooking = async () => {
      try {
        const res = await fetch(API_URL + "/bookings/" + id);
        const booking = await res.json();
        console.log(booking);
        setFailed(!(booking.id === id));
      } catch (error) {
        setFailed(true);
        console.error("Booking verification failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      verifyBooking();
    }
  }, [id]);

  if (loading) return <LoadingComponent />;

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {failed ? (
        <CircleX className="h-16 w-16 text-red-500 mb-6" />
      ) : (
        <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
      )}

      {id ? (
        <>
          <h1 className="text-3xl font-bold mb-2">{failed ? "Booking Failed" : "Booking Confirmed"}</h1>
          <p className="text-gray-500 text-sm mb-8">Ref ID: {id}</p>
          <p className="text-gray-500 text-sm mb-8">
            {failed
              ? `Booking failed. No bookings found for id - ${id}. Please contact help for more details.`
              : "Your booking is confirmed."}
          </p>
        </>
      ) : (
        <p className="text-gray-500 text-sm mb-8">{"You'll be redirected to this page after you book your slot."}</p>
      )}

      <Link
        href="/"
        className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
