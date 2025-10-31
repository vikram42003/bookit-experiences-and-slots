/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/lib/config";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [experienceData, setExperienceData] = useState<any>(null);
  const [timeSlotData, setTimeSlotData] = useState<any>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
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
      const slot = data.timeSlots.find((s: any) => s.id === timeSlotId);
      setTimeSlotData(slot);
    };
    if (experienceId && timeSlotId) fetchData();
  }, [experienceId, timeSlotId]);

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
      }
    } catch (error) {
      console.error("Promo validation failed:", error);
    }
  };

  if (!experienceData || !timeSlotData) return <div>Loading...</div>;

  const subtotal = experienceData.price * quantity;
  const discountedSubtotal = subtotal - discount;
  const taxes = Math.round(discountedSubtotal * 0.18);
  const total = discountedSubtotal + taxes;

  const dateTime = new Date(timeSlotData.dateTime);
  const dateStr = dateTime.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
  const timeStr = dateTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto">
        <Link href={`/experience/${experienceId}`} className="flex items-center gap-4 pb-4">
          <ArrowLeft className="h-4 w-4" />
          Checkout
        </Link>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <Input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="flex gap-2">
              <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              <Button onClick={handleApplyPromo}>Apply</Button>
            </div>
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

          <Card className="p-6 space-y-3">
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
              disabled={!fullName || !email || !agreedToTerms}
            >
              Pay and Confirm
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
