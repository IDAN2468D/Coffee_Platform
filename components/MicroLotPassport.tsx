"use client";

import React, { useState } from "react";
import { QrCode, Globe, Award, ShieldCheck, MapPin, Sparkles, Mountain, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface MicroLotData {
  id: string;
  lotName: string;
  country: string;
  region: string;
  altitude: string;
  farmer: string;
  farmName: string;
  varietal: string;
  process: string;
  soilType: string;
  farmerPremium: string;
  harvestDate: string;
  scaScore: number;
  qrUrl: string;
  flavorProfile: string[];
}

const MICROLOTS: MicroLotData[] = [
  {
    id: "pink-bourbon",
    lotName: "El Paraíso Pink Bourbon Ultra-Lot #88",
    country: "קולומביה",
    region: "Huila (Piendamo)",
    altitude: "1,950 מטר מעל פני הים",
    farmer: "דייגו סמואל ברמודז",
    farmName: "Finca El Paraíso",
    varietal: "Pink Bourbon (מוטציה טבעית של Red & Yellow Bourbon)",
    process: "Thermal Shock & Anaerobic (48h Yeast)",
    soilType: "אפר וולקני עשיר באשלגן וסיליקה",
    farmerPremium: "+448% מעל מחירי בורסת הסחורות (C-Market)",
    harvestDate: "מאי 2026",
    scaScore: 91.5,
    qrUrl: "https://digitalroast.coffee/terroir-passport/pink-bourbon",
    flavorProfile: ["פפאיה אדומה", "פרחי יסמין", "סוכר קנים מוזהב", "יוגורט אפרסק"]
  },
  {
    id: "geisha-boquete",
    lotName: "Hacienda La Esmeralda Geisha Grand Reserve",
    country: "פנמה",
    region: "Boquete (Chiriquí)",
    altitude: "1,850 מטר",
    farmer: "משפחת פטרסון (Peterson Family)",
    farmName: "Jaramillo Micro-Farm",
    varietal: "Panama Geisha (מקור גנטי: יער גיישה, אתיופיה 1931)",
    process: "Slow Dry Natural (28 ימי ייבוש במיטות אפריקאיות)",
    soilType: "קרקע געשית כהה ועשירה במינרלים מהר הגעש בארו (Barú)",
    farmerPremium: "+820% פרמיית איכות עולמית",
    harvestDate: "מרץ 2026",
    scaScore: 94.0,
    qrUrl: "https://digitalroast.coffee/terroir-passport/geisha-boquete",
    flavorProfile: ["מי ורדים", "ברגמוט אתיופי", "פירות יער", "דבש לבן"]
  }
];

export default function MicroLotPassport() {
  const [selectedLot, setSelectedLot] = useState<MicroLotData>(MICROLOTS[0]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6 text-right font-sans" dir="rtl">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 md:p-8 backdrop-blur-2xl bg-black/60 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs md:text-sm font-bold tracking-wider uppercase mb-1">
            <Globe className="w-4 h-4" />
            דרכון טרואר ושקיפות מיקרו-לוט • Sprint 12 Flagship
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white">
            דרכון גנטיקה וטרואר דיגיטלי (DNA Passport)
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1">
            אימות ישיר של שרשרת הערך, עץ גנטיקה בוטני, מינרלוגיית קרקע וקוד QR מאומת.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
          SCA Score: {selectedLot.scaScore} / 100
        </span>
      </div>

      {/* Lot Selector Tabs */}
      <div className="flex gap-3">
        {MICROLOTS.map((lot) => (
          <button
            key={lot.id}
            onClick={() => setSelectedLot(lot)}
            className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-bold border transition-all cursor-pointer ${
              selectedLot.id === lot.id
                ? "bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20"
                : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            {lot.lotName.split(" ")[0]} {lot.lotName.split(" ")[1]} ({lot.country})
          </button>
        ))}
      </div>

      {/* Passport Certificate Card */}
      <div className="rounded-3xl p-6 md:p-8 backdrop-blur-2xl bg-black/80 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)] space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-5 gap-4">
          <div>
            <div className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
              OFFICIAL SPECIALTY COFFEE PASSPORT & ORIGIN DNA
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1">{selectedLot.lotName}</h2>
            <div className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {selectedLot.farmName} • {selectedLot.region}, {selectedLot.country}
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl shrink-0 shadow-lg">
            <QRCodeSVG value={selectedLot.qrUrl} size={84} />
          </div>
        </div>

        {/* Passport Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs md:text-sm">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-zinc-400 text-xs">חקלאי ומגדל:</span>
            <div className="font-bold text-white text-base">{selectedLot.farmer}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-zinc-400 text-xs">גובה המטע:</span>
            <div className="font-bold text-emerald-300 text-base">{selectedLot.altitude}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-zinc-400 text-xs">שיטת עיבוד:</span>
            <div className="font-bold text-amber-300 text-base">{selectedLot.process}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-zinc-400 text-xs">זן בוטני ומקור גנטי:</span>
            <div className="font-bold text-zinc-200 text-base">{selectedLot.varietal}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-zinc-400 text-xs">מינרלוגיית קרקע:</span>
            <div className="font-bold text-zinc-200 text-base">{selectedLot.soilType}</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-1">
            <span className="text-emerald-400 text-xs font-bold">פרמיית חקלאי ששולמה:</span>
            <div className="font-black text-emerald-300 text-base">{selectedLot.farmerPremium}</div>
          </div>
        </div>

        {/* Sensory Flavor Tags */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
          <span className="text-xs font-bold text-zinc-300">תווי טעם מאומתים בקאפינג (SCA Cupping Notes):</span>
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedLot.flavorProfile.map((note) => (
              <span key={note} className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {note}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
