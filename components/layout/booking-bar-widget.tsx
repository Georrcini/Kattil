"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Calendar, ChevronDown, Check, Search, X } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
export type PropertyValue = "kattil" | "kattilchennai" | "kattilcoimbatore";

interface FpInstance {
  destroy: () => void;
  close: () => void;
  open: () => void;
  setDate: (d: (Date | string)[] | Date | string, triggerChange?: boolean) => void;
  set: (opt: string, val: unknown) => void;
  selectedDates: Date[];
}

declare global {
  interface Window {
    flatpickr?: (el: HTMLElement, opts: Record<string, unknown>) => FpInstance;
  }
}

export const PROPERTIES: { label: string; city: string; value: PropertyValue }[] = [
  { label: "Kattil Chennai", city: "Chennai", value: "kattilchennai" },
  { label: "Kattil Madurai", city: "Madurai", value: "kattil" },
  { label: "Kattil Coimbatore", city: "Coimbatore", value: "kattilcoimbatore" },
];

const MADURAI_ROOMS = [
  { label: "Bed in Dormitory", value: "6154300000000000001" },
  { label: "Standard AC Room", value: "6154300000000000002" },
  { label: "Standard Non A/C", value: "6154300000000000004" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function forPost(d: Date | null): string {
  if (!d) return "";
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

function formatDateDisplay(d: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

// ── Widget Component ──────────────────────────────────────────────────────────
export default function BookingBarWidget() {
  const [property, setProperty] = useState<PropertyValue | "">("");
  const [roomType, setRoomType] = useState("");
  const [checkin, setCheckin] = useState<Date | null>(null);
  const [checkout, setCheckout] = useState<Date | null>(null);
  const [dateDisplay, setDateDisplay] = useState("");
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [propertiesList, setPropertiesList] = useState<{ label: string; city: string; value: PropertyValue }[]>(PROPERTIES);

  const dateInputRef = useRef<HTMLInputElement>(null);
  const fpInstance = useRef<FpInstance | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isMadurai = property === "kattil";
  const selectedPropertyObj = propertiesList.find((p) => p.value === property) || PROPERTIES.find((p) => p.value === property);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (propertyDropdownOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 60);
    } else {
      setSearchQuery("");
    }
  }, [propertyDropdownOpen]);

  // Dynamically load active destinations from API
  useEffect(() => {
    fetch("/api/destinations")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const dynamicProps = data.data.map((d: any) => ({
            label: `Kattil ${d.name}`,
            city: d.name,
            value: (d.slug === "chennai"
              ? "kattilchennai"
              : d.slug === "madurai"
                ? "kattil"
                : d.slug === "coimbatore"
                  ? "kattilcoimbatore"
                  : `kattil${d.slug}`) as PropertyValue,
          }));
          const merged = [...PROPERTIES];
          for (const dp of dynamicProps) {
            if (!merged.some((m) => m.city.toLowerCase() === dp.city.toLowerCase())) {
              merged.push(dp);
            }
          }
          setPropertiesList(merged);
        }
      })
      .catch(() => { });
  }, []);

  // Filter properties based on search query
  const filteredProperties = propertiesList.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.label.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.value.toLowerCase().includes(q)
    );
  });

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPropertyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load Flatpickr once
  useEffect(() => {
    let alive = true;

    function closeFlatpickr() {
      fpInstance.current?.close();
    }

    function injectStyle(href: string) {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      document.head.appendChild(l);
    }

    function injectScript(src: string): Promise<void> {
      return new Promise((res, rej) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          res();
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => res();
        s.onerror = () => rej(new Error(`Failed: ${src}`));
        document.head.appendChild(s);
      });
    }

    (async () => {
      try {
        injectStyle("https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css");
        await injectScript("https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js");
        if (!alive || !window.flatpickr || !dateInputRef.current) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        fpInstance.current = window.flatpickr(dateInputRef.current, {
          mode: "range",
          dateFormat: "d M Y",
          minDate: today,
          disableMobile: true,
          appendTo: document.body,
          showMonths: 1,
          onChange(dates: Date[]) {
            if (dates.length === 2) {
              const d1 = new Date(dates[0]);
              d1.setHours(0, 0, 0, 0);
              const d2 = new Date(dates[1]);
              d2.setHours(0, 0, 0, 0);
              setCheckin(d1);
              setCheckout(d2);
              setDateDisplay(`${formatDateDisplay(d1)} - ${formatDateDisplay(d2)}`);
            } else if (dates.length === 1) {
              const d1 = new Date(dates[0]);
              d1.setHours(0, 0, 0, 0);
              setCheckin(d1);
              setCheckout(null);
              setDateDisplay(`${formatDateDisplay(d1)} - ...`);
            }
          },
        });

        window.addEventListener("scroll", closeFlatpickr, { passive: true });
      } catch (e) {
        console.error("[BookingWidget]", e);
      }
    })();

    return () => {
      alive = false;
      window.removeEventListener("scroll", closeFlatpickr);
      fpInstance.current?.destroy();
    };
  }, []);

  // ── Book Now / Check Availability ───────────────────────────────────────────
  function handleCheckAvailability() {
    const targetProperty = property || "kattilchennai";
    const ci = checkin || new Date();
    const co = checkout || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

    const form = document.getElementById("_resBBBox") as HTMLFormElement;
    if (!form) return;
    (document.getElementById("h_chkin") as HTMLInputElement).value = forPost(ci);
    (document.getElementById("h_chkout") as HTMLInputElement).value = forPost(co);
    (document.getElementById("h_hotel") as HTMLInputElement).value = targetProperty;
    (document.getElementById("h_room") as HTMLInputElement).value = isMadurai ? roomType : "";
    form.action = `https://live.ipms247.com/booking/book-rooms-${targetProperty}`;
    form.submit();
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="w-[88%] sm:w-[92%] md:w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-[8px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-3 sm:p-4.5 md:p-6 text-left">
          <form id="_resBBBox" method="post" target="_blank" onSubmit={(e) => { e.preventDefault(); handleCheckAvailability(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_236px] items-end gap-2.5 sm:gap-3 md:gap-4 w-full min-w-0">
              {/* 1. Choose your stay */}
              <div className="relative" ref={dropdownRef}>
                <label className="text-[11px] sm:text-xs md:text-[13px] font-semibold text-gray-700 block mb-1 sm:mb-1.5 tracking-tight font-sans">
                  Choose your stay
                </label>
                <button
                  type="button"
                  onClick={() => setPropertyDropdownOpen((prev) => !prev)}
                  className="w-full h-[39px] sm:h-[43px] border-[1px] border-[#E5E7EB] bg-[#F9FAFB] rounded-[6px] px-3.5 sm:px-[16px] py-0 flex items-center justify-between gap-2 transition-all text-left"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0 stroke-[1.6]" />

                    <span
                      className={`text-[13px] sm:text-[14px] truncate ${selectedPropertyObj
                        ? "text-gray-900 font-medium"
                        : "text-gray-400"
                        }`}
                    >
                      {selectedPropertyObj
                        ? `${selectedPropertyObj.city} (${selectedPropertyObj.label})`
                        : "Select a location or Property"}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${propertyDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {propertyDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                    >
                      {/* Search Input Bar */}
                      <div className="px-3 pb-2 pt-1 border-b border-gray-100">
                        <div className="relative flex items-center">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search city or property..."
                            className="w-full h-8.5 pl-8 pr-7 text-[13px] bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#0E2E4E] transition-colors text-gray-800 placeholder-gray-400 font-sans"
                            onClick={(e) => e.stopPropagation()}
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchQuery("");
                                searchInputRef.current?.focus();
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        {filteredProperties.length > 0 ? "Available Locations" : "No matches"}
                      </div>

                      <div className="max-h-56 overflow-y-auto">
                        {filteredProperties.length === 0 ? (
                          <div className="py-6 px-4 text-center text-xs text-gray-400 font-sans">
                            No locations matching &ldquo;{searchQuery}&rdquo;
                          </div>
                        ) : (
                          filteredProperties.map((p) => {
                            const isSelected = property === p.value;
                            return (
                              <button
                                key={p.value}
                                type="button"
                                onClick={() => {
                                  setProperty(p.value);
                                  setPropertyDropdownOpen(false);
                                }}
                                className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors ${isSelected ? "bg-emerald-50/70 text-gray-900 font-medium" : "text-gray-700"
                                  }`}
                              >
                                <div className="flex flex-col">
                                  <span className="text-[14px] leading-tight font-medium text-gray-900">{p.label}</span>
                                  <span className="text-[12px] text-gray-500 leading-tight mt-0.5">{p.city}, Tamil Nadu</span>
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Check In & Out */}
              <div className="relative">
                <label className="text-[11px] sm:text-xs md:text-[13px] font-semibold text-gray-700 block mb-1 sm:mb-1.5 tracking-tight font-sans">
                  Check In & Out
                </label>

                <div
                  onClick={() => fpInstance.current?.open()}
                  className="w-full h-[39px] sm:h-[43px] border-[1px] border-[#E5E7EB] bg-[#F9FAFB] rounded-[6px] px-3.5 sm:px-[16px] flex items-center gap-2.5 sm:gap-3 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0 stroke-[1.6]" />

                  <input
                    ref={dateInputRef}
                    type="text"
                    readOnly
                    value={dateDisplay}
                    placeholder="Select check-in & check-out"
                    className="w-full bg-transparent text-[13px] sm:text-[14px] text-gray-900 font-medium outline-none cursor-pointer placeholder-gray-400 font-sans"
                  />
                </div>
              </div>

              {/* 3. Check Availability CTA */}
              <div className="w-full md:w-auto">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="
      w-full md:w-[236px]
      h-[42px] sm:h-[46px]
      bg-[#0E2E4E]
      text-white
      text-[13px] sm:text-[14px]
      font-semibold
      rounded-[6px]
      px-4 sm:px-[32px]
      py-2 sm:py-[12px]
      flex items-center justify-center
      gap-[8px]
      whitespace-nowrap
      shadow-md
      transition-all
      cursor-pointer
    "
                >
                  Check Availability
                </motion.button>
              </div>

            </div>

            {/* Hidden POST fields for IPMS engine */}
            <input type="hidden" id="h_chkin" name="eZ_chkin" />
            <input type="hidden" id="h_chkout" name="eZ_chkout" />
            <input type="hidden" id="h_hotel" name="select_hotel" value={property || "kattilchennai"} />
            <input type="hidden" id="h_room" name="roomtypeunkid" value={isMadurai ? roomType : ""} />
            <input type="hidden" name="eZ_adult" value="1" />
            <input type="hidden" name="eZ_child" value="0" />
            <input type="hidden" name="eZ_Nights" value="1" />
            <input type="hidden" name="eZ_room" value="1" />
            <input type="hidden" name="calformat" value="dd-mm-yy" />
          </form>
        </div>
      </div>
    </>
  );
}

// ── Flatpickr custom brand styling ────────────────────────────────────────────
const STYLES = `
  .flatpickr-calendar {
    border-radius: 18px !important;
    box-shadow: 0 25px 60px -10px rgba(0,0,0,0.25), 0 10px 24px -5px rgba(0,0,0,0.1) !important;
    border: 1px solid rgba(0,0,0,0.06) !important;
    font-family: var(--font-inter), system-ui, sans-serif !important;
    padding: 12px !important;
    width: 320px !important;
  }
  .flatpickr-calendar.arrowTop:before,
  .flatpickr-calendar.arrowTop:after { display: none !important; }

  .flatpickr-months {
    background: transparent !important;
    margin-bottom: 8px !important;
  }
  .flatpickr-month {
    height: 40px !important;
    color: #0d1b2e !important;
  }

  .flatpickr-current-month {
    font-size: 15px !important;
    font-weight: 700 !important;
    color: #0d1b2e !important;
    padding-top: 6px !important;
  }
  .flatpickr-current-month .flatpickr-monthDropdown-months,
  .flatpickr-current-month input.cur-year {
    color: #0d1b2e !important;
    font-weight: 700 !important;
  }

  .flatpickr-prev-month, .flatpickr-next-month {
    fill: #0d1b2e !important;
    color: #0d1b2e !important;
    padding: 8px !important;
    border-radius: 8px !important;
  }
  .flatpickr-prev-month:hover, .flatpickr-next-month:hover {
    background: #f1f5f9 !important;
  }

  .flatpickr-weekdays {
    background: transparent !important;
    margin-bottom: 6px !important;
  }
  .flatpickr-weekday {
    color: #94a3b8 !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
  }

  .flatpickr-day {
    font-size: 13px !important;
    font-weight: 500 !important;
    border-radius: 10px !important;
    color: #1e293b !important;
    height: 36px !important;
    line-height: 36px !important;
    margin: 2px 0 !important;
  }
  .flatpickr-day:hover {
    background: #f1f5f9 !important;
    color: #0d1b2e !important;
  }
  .flatpickr-day.selected,
  .flatpickr-day.startRange,
  .flatpickr-day.endRange {
    background: #0d1b2e !important;
    color: #ffffff !important;
    font-weight: 700 !important;
    border-color: #0d1b2e !important;
  }
  .flatpickr-day.inRange {
    background: #e2e8f0 !important;
    color: #0d1b2e !important;
    box-shadow: -5px 0 0 #e2e8f0, 5px 0 0 #e2e8f0 !important;
  }
  .flatpickr-day.today {
    border: 1.5px solid #0d1b2e !important;
  }
  .flatpickr-day.disabled,
  .flatpickr-day.prevMonthDay,
  .flatpickr-day.nextMonthDay {
    color: #cbd5e1 !important;
  }
`;

