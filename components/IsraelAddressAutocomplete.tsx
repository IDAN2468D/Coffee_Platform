'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Search,
  Check,
  Building2,
  Navigation,
  Sparkles,
  ChevronDown,
  X,
  Loader2,
  ShieldCheck,
  Home,
  AlertCircle,
} from 'lucide-react';

export interface AddressSelection {
  city: string;
  street: string;
  houseNumber: string;
  apartment?: string;
  floor?: string;
  entrance?: string;
  notes?: string;
  fullAddress: string;
  isVerified?: boolean;
  isValid?: boolean;
}

interface IsraelAddressAutocompleteProps {
  value?: string;
  onChange: (fullAddress: string, structuredData?: AddressSelection) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
  showValidationErrors?: boolean;
}

const QUICK_POPULAR_CITIES = [
  'תל אביב - יפו',
  'ירושלים',
  'חיפה',
  'ראשון לציון',
  'פתח תקווה',
  'הרצליה',
  'רמת גן',
  'נתניה',
  'באר שבע',
  'כפר סבא',
  'רעננה',
  'חולון',
];

export const IsraelAddressAutocomplete: React.FC<IsraelAddressAutocompleteProps> = ({
  value = '',
  onChange,
  required = true,
  className = '',
  placeholder = 'הזן עיר או רחוב למשלוח...',
  showValidationErrors = false,
}) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [apartment, setApartment] = useState('');
  const [floor, setFloor] = useState('');
  const [entrance, setEntrance] = useState('');

  // Search states
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [streetSearchQuery, setStreetSearchQuery] = useState('');
  const [citiesList, setCitiesList] = useState<Array<{ name: string; code: number; region?: string }>>([]);
  const [streetsList, setStreetsList] = useState<Array<{ name: string; code: number; cityName: string }>>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingStreets, setLoadingStreets] = useState(false);

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isStreetDropdownOpen, setIsStreetDropdownOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const streetInputRef = useRef<HTMLInputElement>(null);
  const houseNumInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
        setIsStreetDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Cities from API
  const fetchCities = async (q: string) => {
    setLoadingCities(true);
    try {
      const res = await fetch(`/api/israel-addresses?type=cities&q=${encodeURIComponent(q.trim())}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setCitiesList(data.cities || []);
      }
    } catch (err) {
      console.warn('City fetch error:', err);
    } finally {
      setLoadingCities(false);
    }
  };

  // Fetch Streets from API for selected city
  const fetchStreets = async (streetQuery: string, cityName?: string) => {
    setLoadingStreets(true);
    try {
      const targetCity = cityName || selectedCity;
      const params = new URLSearchParams({
        type: 'streets',
        q: streetQuery.trim(),
        limit: '25',
      });
      if (targetCity) params.set('city', targetCity);

      const res = await fetch(`/api/israel-addresses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStreetsList(data.streets || []);
      }
    } catch (err) {
      console.warn('Street fetch error:', err);
    } finally {
      setLoadingStreets(false);
    }
  };

  // Helper to construct and emit full address
  const emitAddress = (
    c: string,
    s: string,
    num: string,
    apt: string,
    fl: string,
    ent: string
  ) => {
    const parts: string[] = [];
    if (s) {
      parts.push(num ? `${s} ${num}` : s);
    }
    if (apt) parts.push(`דירה ${apt}`);
    if (fl) parts.push(`קומה ${fl}`);
    if (ent) parts.push(`כניסה ${ent}`);
    if (c) parts.push(c);

    const fullFormatted = parts.join(', ');
    const isValid = Boolean(c.trim() && s.trim() && num.trim());

    onChange(fullFormatted, {
      city: c.trim(),
      street: s.trim(),
      houseNumber: num.trim(),
      apartment: apt.trim(),
      floor: fl.trim(),
      entrance: ent.trim(),
      fullAddress: fullFormatted,
      isVerified: Boolean(c.trim() && s.trim()),
      isValid,
    });
  };

  // 1. City Input Change
  const handleCityChange = (text: string) => {
    setCitySearchQuery(text);
    setSelectedCity(text);
    setIsCityDropdownOpen(true);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      fetchCities(text);
    }, 200);

    emitAddress(text, selectedStreet, houseNumber, apartment, floor, entrance);
  };

  // 2. City Selection from Dropdown or Quick Chips
  const handleSelectCity = (cityName: string) => {
    setSelectedCity(cityName);
    setCitySearchQuery(cityName);
    setIsCityDropdownOpen(false);

    // Trigger street search for new city
    fetchStreets(selectedStreet || '', cityName);
    emitAddress(cityName, selectedStreet, houseNumber, apartment, floor, entrance);

    // Focus street field for seamless flow
    setTimeout(() => {
      if (streetInputRef.current) {
        streetInputRef.current.focus();
        setIsStreetDropdownOpen(true);
      }
    }, 50);
  };

  // 3. Street Input Change (STRICTLY sets only the street name!)
  const handleStreetChange = (text: string) => {
    setStreetSearchQuery(text);
    setSelectedStreet(text);
    setIsStreetDropdownOpen(true);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      fetchStreets(text, selectedCity);
    }, 200);

    emitAddress(selectedCity, text, houseNumber, apartment, floor, entrance);
  };

  // 4. Street Selection from Dropdown (STRICTLY sets only the street name!)
  const handleSelectStreet = (streetName: string, cityName?: string) => {
    // Only street name goes to street field!
    setSelectedStreet(streetName);
    setStreetSearchQuery(streetName);
    setIsStreetDropdownOpen(false);
    setIsVerified(true);

    let currentCity = selectedCity;
    if (cityName && !selectedCity) {
      currentCity = cityName;
      setSelectedCity(cityName);
      setCitySearchQuery(cityName);
    }

    emitAddress(currentCity, streetName, houseNumber, apartment, floor, entrance);

    // Focus house number field
    setTimeout(() => {
      if (houseNumInputRef.current) {
        houseNumInputRef.current.focus();
      }
    }, 50);
  };

  // 5. House number change
  const handleHouseNumChange = (num: string) => {
    setHouseNumber(num);
    emitAddress(selectedCity, selectedStreet, num, apartment, floor, entrance);
  };

  const handleClear = () => {
    setSelectedCity('');
    setCitySearchQuery('');
    setSelectedStreet('');
    setStreetSearchQuery('');
    setHouseNumber('');
    setApartment('');
    setFloor('');
    setEntrance('');
    setIsVerified(false);
    onChange('', undefined);
  };

  // Validation flags for visual feedback
  const isCityMissing = showValidationErrors && !selectedCity.trim();
  const isStreetMissing = showValidationErrors && !selectedStreet.trim();
  const isHouseNumMissing = showValidationErrors && !houseNumber.trim();

  return (
    <div ref={containerRef} className={`space-y-2.5 text-right ${className}`} dir="rtl">
      {/* Gov Verification Badge Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-500" />
          <span>הזנת כתובת מאומתת בישראל:</span>
        </span>

        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>מאגר הכתובות הלאומי data.gov.il</span>
        </div>
      </div>

      {/* Quick City Selector Chips */}
      <div>
        <div className="text-[10px] text-stone-400 mb-1 flex items-center justify-between">
          <span>בחירה מהירה של עיר:</span>
          {(selectedCity || selectedStreet) && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[10px] text-rose-400 hover:text-rose-300 font-bold"
            >
              נקה שדות
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {QUICK_POPULAR_CITIES.map((city) => (
            <button
              key={`quick-${city}`}
              type="button"
              onClick={() => handleSelectCity(city)}
              className={`px-2 py-0.5 rounded-md text-[10px] transition-all border ${
                selectedCity === city
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: City Input & Dropdown */}
      <div className="relative">
        <label className="block text-[11px] font-bold text-stone-300 mb-1">
          1. עיר / ישוב למשלוח *
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            required={required}
            value={citySearchQuery || selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            onFocus={() => {
              setIsCityDropdownOpen(true);
              if (citiesList.length === 0) fetchCities(selectedCity);
            }}
            placeholder="הקלד שם עיר (למשל תל אביב, ירושלים, חיפה)..."
            className={`w-full pr-8 pl-8 py-2 rounded-xl bg-stone-950 border text-xs text-stone-100 placeholder-stone-500 focus:outline-none transition-all text-right ${
              isCityMissing
                ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                : selectedCity
                ? 'border-emerald-500/60 focus:border-emerald-500'
                : 'border-stone-800 focus:border-amber-500'
            }`}
            dir="rtl"
          />
          <Building2 className="w-3.5 h-3.5 text-amber-500 absolute right-2.5 pointer-events-none" />

          <div className="absolute left-2.5 flex items-center gap-1">
            {loadingCities && <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
            {selectedCity && (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <button
              type="button"
              onClick={() => {
                setIsCityDropdownOpen((prev) => !prev);
                if (!isCityDropdownOpen) fetchCities(selectedCity);
              }}
              className="text-stone-400 hover:text-stone-200 p-0.5"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* City Dropdown Menu */}
        {isCityDropdownOpen && (
          <div className="absolute z-50 top-full mt-1 w-full rounded-xl bg-stone-950/95 backdrop-blur-xl border border-amber-500/30 shadow-2xl p-1.5 max-h-48 overflow-y-auto space-y-0.5 divide-y divide-stone-900">
            {citiesList.length > 0 ? (
              citiesList.map((c, idx) => (
                <button
                  key={`city-item-${c.code}-${idx}`}
                  type="button"
                  onClick={() => handleSelectCity(c.name)}
                  className="w-full text-right px-2.5 py-1.5 rounded-lg hover:bg-amber-500/20 text-stone-200 hover:text-amber-300 text-xs flex items-center justify-between transition-colors"
                >
                  <span className="font-bold">{c.name}</span>
                  {c.region && <span className="text-[10px] text-stone-500">{c.region}</span>}
                </button>
              ))
            ) : (
              <div className="p-2 text-center text-xs text-stone-500">לא נמצאו ישובים תואמים</div>
            )}
          </div>
        )}
      </div>

      {/* Step 2: Street Input & Dropdown (Strictly Street Name Only!) */}
      <div className="relative">
        <label className="block text-[11px] font-bold text-stone-300 mb-1">
          2. שם רחוב {selectedCity ? `ב${selectedCity}` : ''} *
        </label>
        <div className="relative flex items-center">
          <input
            ref={streetInputRef}
            type="text"
            required={required}
            value={streetSearchQuery || selectedStreet}
            onChange={(e) => handleStreetChange(e.target.value)}
            onFocus={() => {
              setIsStreetDropdownOpen(true);
              fetchStreets(selectedStreet, selectedCity);
            }}
            placeholder={
              selectedCity
                ? `הקלד שם רחוב ב${selectedCity} (למשל דיזנגוף, רוטשילד)...`
                : 'הקלד שם רחוב...'
            }
            className={`w-full pr-8 pl-8 py-2 rounded-xl bg-stone-950 border text-xs text-stone-100 placeholder-stone-500 focus:outline-none transition-all text-right ${
              isStreetMissing
                ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                : selectedStreet
                ? 'border-emerald-500/60 focus:border-emerald-500'
                : 'border-stone-800 focus:border-amber-500'
            }`}
            dir="rtl"
          />
          <Navigation className="w-3.5 h-3.5 text-amber-500 absolute right-2.5 pointer-events-none" />

          <div className="absolute left-2.5 flex items-center gap-1">
            {loadingStreets && <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
            {selectedStreet && (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <button
              type="button"
              onClick={() => {
                setIsStreetDropdownOpen((prev) => !prev);
                if (!isStreetDropdownOpen) fetchStreets(selectedStreet, selectedCity);
              }}
              className="text-stone-400 hover:text-stone-200 p-0.5"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Street Dropdown Menu */}
        {isStreetDropdownOpen && (
          <div className="absolute z-50 top-full mt-1 w-full rounded-xl bg-stone-950/95 backdrop-blur-xl border border-amber-500/30 shadow-2xl p-1.5 max-h-48 overflow-y-auto space-y-0.5 divide-y divide-stone-900">
            {streetsList.length > 0 ? (
              streetsList.map((s, idx) => (
                <button
                  key={`street-item-${s.code}-${idx}`}
                  type="button"
                  onClick={() => handleSelectStreet(s.name, s.cityName)}
                  className="w-full text-right px-2.5 py-1.5 rounded-lg hover:bg-amber-500/20 text-stone-200 hover:text-amber-300 text-xs flex items-center justify-between transition-colors"
                >
                  <span className="font-bold">{s.name}</span>
                  <span className="text-[10px] text-stone-500">{s.cityName}</span>
                </button>
              ))
            ) : (
              <div className="p-2 text-center text-xs text-stone-500">
                הקלד שם רחוב לבחירה ממאגר הרחובות
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step 3: House Number, Apartment, Floor, Entrance Sub-fields */}
      <div className="grid grid-cols-4 gap-1.5 pt-1">
        <div>
          <label className="block text-[10px] text-stone-400 mb-0.5">מספר בית *</label>
          <input
            ref={houseNumInputRef}
            type="text"
            required={required}
            placeholder="12"
            value={houseNumber}
            onChange={(e) => handleHouseNumChange(e.target.value)}
            className={`w-full px-2 py-1.5 rounded-lg bg-stone-950 border text-xs text-stone-100 placeholder-stone-600 focus:outline-none text-center font-mono ${
              isHouseNumMissing
                ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                : houseNumber
                ? 'border-emerald-500/60'
                : 'border-stone-800 focus:border-amber-500'
            }`}
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-[10px] text-stone-400 mb-0.5">דירה</label>
          <input
            type="text"
            placeholder="4"
            value={apartment}
            onChange={(e) => {
              setApartment(e.target.value);
              emitAddress(selectedCity, selectedStreet, houseNumber, e.target.value, floor, entrance);
            }}
            className="w-full px-2 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-center font-mono"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-[10px] text-stone-400 mb-0.5">קומה</label>
          <input
            type="text"
            placeholder="2"
            value={floor}
            onChange={(e) => {
              setFloor(e.target.value);
              emitAddress(selectedCity, selectedStreet, houseNumber, apartment, e.target.value, entrance);
            }}
            className="w-full px-2 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-center font-mono"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-[10px] text-stone-400 mb-0.5">כניסה</label>
          <input
            type="text"
            placeholder="א'"
            value={entrance}
            onChange={(e) => {
              setEntrance(e.target.value);
              emitAddress(selectedCity, selectedStreet, houseNumber, apartment, floor, e.target.value);
            }}
            className="w-full px-2 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-center"
            dir="rtl"
          />
        </div>
      </div>

      {/* Validation Warning Alert (if user tried to submit with missing parts) */}
      {(isCityMissing || isStreetMissing || isHouseNumMissing) && (
        <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-400 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            {isCityMissing && 'נא לבחור עיר למשלוח. '}
            {isStreetMissing && 'נא להזין שם רחוב. '}
            {isHouseNumMissing && 'נא לציין מספר בית.'}
          </span>
        </div>
      )}

      {/* Formatted Address Live Verification Preview */}
      {selectedCity && selectedStreet && (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-center justify-between text-emerald-200">
          <div className="flex items-center gap-1.5 min-w-0">
            <Home className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate font-bold">
              {selectedStreet} {houseNumber ? `${houseNumber}` : ''}
              {apartment ? `, דירה ${apartment}` : ''}
              {floor ? `, קומה ${floor}` : ''}
              {entrance ? `, כניסה ${entrance}` : ''}, {selectedCity}
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold flex-shrink-0 font-mono">
            <Check className="w-3 h-3" /> מאומת
          </span>
        </div>
      )}
    </div>
  );
};
