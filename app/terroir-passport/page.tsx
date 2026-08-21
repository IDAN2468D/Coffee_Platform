import React from "react";
import MicroLotPassport from "@/components/MicroLotPassport";

export const metadata = {
  title: "דרכון גנטיקה וטרואר דיגיטלי (DNA Passport) | The Digital Roast",
  description: "אימות ישיר של שרשרת הערך, עץ גנטיקה בוטני, מינרלוגיית קרקע וקוד QR מאומת."
};

export default function TerroirPassportPage() {
  return (
    <main className="min-h-screen bg-[#050404] text-white pt-24 pb-16 px-4">
      <MicroLotPassport />
    </main>
  );
}
