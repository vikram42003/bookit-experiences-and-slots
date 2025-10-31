"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/lib/config";
import { BookingType, CreateBookingType, ExperienceType, TimeSlotType } from "@/types/types";
import LoadingComponent from "@/components/LoadingComponent";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const [experienceData, setExperienceData] = useState<ExperienceType | null>(null);
  const [timeSlotData, setTimeSlotData] = useState<TimeSlotType | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [invalidCoupon, setInvalidCoupon] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const experienceId = searchParams.get("experienceId");
  const timeSlotId = searchParams.get("timeSlotId");
  const quantity = parseInt(searchParams.get("quantity") || "1");

  useEffect(() => {
    const fetchData = async () => {
      const expRes = await fetch(`${API_URL}/experiences/${experienceId}`);
      const data = await expRes.json();
      setExperienceData(data.experience);
      const slot = data.timeSlots.find((s: { id: string | null }) => s.id === timeSlotId);
      setTimeSlotData(slot);
    };
    if (experienceId && timeSlotId) fetchData();
  }, [experienceId, timeSlotId]);

  if (!experienceData || !timeSlotData) return <LoadingComponent />;

  const subtotal = experienceData.price * quantity;
  const discountedSubtotal = subtotal - discount;
  const taxes = Math.round(discountedSubtotal * 0.18);
  const total = discountedSubtotal + taxes;

  const dateTime = new Date(timeSlotData.dateTime);
  const dateStr = dateTime.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
  const timeStr = dateTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  const handleApplyPromo = async () => {
    try {
      const res = await fetch(`${API_URL}/promo/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      });
      const data = await res.json();
      if (data.valid) {
        const basePrice = (experienceData?.price || 0) * quantity;
        if (data.promoCode.type === "percentage") {
          setDiscount(basePrice * (data.promoCode.value / 100));
        } else {
          setDiscount(data.promoCode.value);
        }
      } else {
        setInvalidCoupon(true);
        setTimeout(() => {
          setInvalidCoupon(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Promo validation failed:", error);
    }
  };

  const handleCheckout = async () => {
    // We'll only call handle checkout if we have all the variables
    // but this if condition is still needed here to make typescript quiet
    if (!experienceId || !timeSlotId || !fullName || !email || !agreedToTerms) {
      return;
    }
    setLoading(true);
    try {
      const newBooking: CreateBookingType = {
        experience: experienceId,
        timeSlot: timeSlotId,
        quantity,
        userName: fullName,
        userEmail: email,
        promoCode,
        finalPrice: total,
      };

      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking),
      });
      const data: BookingType = await res.json();
      const params = new URLSearchParams({ id: data.id});

      router.push(`/result?${params.toString()}`);
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4">
      <div className="max-w-7xl mx-auto">
        <Link href={`/experiences/${experienceId}`} className="flex items-center gap-4 pb-4">
          <ArrowLeft className="h-4 w-4" />
          Checkout
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/5">
            <Card className="p-6 bg-gray-50 shadow-none">
              <div className="flex gap-4">
                <div className="flex-1/2">
                  <label htmlFor="fullname" className="text-sm text-gray-500">
                    Full name
                  </label>
                  <Input
                    id="fullname"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-gray-200"
                  />
                </div>
                <div className="flex-1/2">
                  <label htmlFor="email" className="text-sm text-gray-500">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-200"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="bg-gray-200"
                />
                <Button onClick={handleApplyPromo}>Apply</Button>
              </div>

              {invalidCoupon && <div className="text-sm text-red-500">Invalid Coupon</div>}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked: boolean) => setAgreedToTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the terms and safety policy
                </label>
              </div>
            </Card>
          </div>

          <Card className="lg:w-2/5 p-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Experience</span>
              <span className="font-semibold">{experienceData.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date</span>
              <span className="font-semibold">{dateStr}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Time</span>
              <span className="font-semibold">{timeStr}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Qty</span>
              <span className="font-semibold">{quantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxes</span>
              <span className="font-semibold">₹{taxes}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">₹{total}</span>
            </div>

            <Button
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
              disabled={!fullName || !email || !agreedToTerms || loading}
              onClick={handleCheckout}
            >
              {loading ? "Loading..." : "Pay and Confirm"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
