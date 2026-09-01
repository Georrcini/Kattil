"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────
type PropertyValue = "kattil" | "kattilchennai" | "kattilcoimbatore";

interface FpInstance {
  destroy: () => void;
  close: () => void;
  setDate: (d: Date | string, triggerChange?: boolean) => void;
  set: (opt: string, val: unknown) => void;
  selectedDates: Date[];
}

declare global {
  interface Window {
    flatpickr?: (el: HTMLElement, opts: Record<string, unknown>) => FpInstance;
  }
}

const PROPERTIES = [
  { shortLabel: "Madurai", value: "kattil" as PropertyValue },
  { shortLabel: "Chennai", value: "kattilchennai" as PropertyValue },
  { shortLabel: "Coimbatore", value: "kattilcoimbatore" as PropertyValue },
];

const MADURAI_ROOMS = [
  { label: "Bed in Dormitory",  value: "6154300000000000001" },
  { label: "Standard",          value: "6154300000000000002" },
  { label: "Standard Non A/C",  value: "6154300000000000004" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function forPost(d: Date | null): string {
  if (!d) return "";
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

// ── Widget ────────────────────────────────────────────────────────────────────
export default function BookingBarWidget() {
  const [property, setProperty] = useState<PropertyValue>("kattilchennai");
  const [roomType, setRoomType]  = useState("");
  const [checkin,  setCheckin]   = useState<Date | null>(null);
  const [checkout, setCheckout]  = useState<Date | null>(null);

  const ciInputRef  = useRef<HTMLInputElement>(null);
  const coInputRef  = useRef<HTMLInputElement>(null);
  const fpCi        = useRef<FpInstance | null>(null);
  const fpCo        = useRef<FpInstance | null>(null);

  const isMadurai = property === "kattil";

  // ── Load Flatpickr once ───────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;

    function closeAll() {
      fpCi.current?.close();
      fpCo.current?.close();
    }

    function injectStyle(href: string) {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const l = document.createElement("link");
      l.rel = "stylesheet"; l.href = href;
      document.head.appendChild(l);
    }

    function injectScript(src: string): Promise<void> {
      return new Promise((res, rej) => {
        if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
        const s = document.createElement("script");
        s.src = src;
        s.onload  = () => res();
        s.onerror = () => rej(new Error(`Failed: ${src}`));
        document.head.appendChild(s);
      });
    }

    (async () => {
      try {
        injectStyle("https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css");
        await injectScript("https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js");
        if (!alive || !window.flatpickr || !ciInputRef.current || !coInputRef.current) return;

        const today    = new Date(); today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

        fpCi.current = window.flatpickr(ciInputRef.current, {
          dateFormat:    "d M Y",
          minDate:       today,
          disableMobile: true,
          appendTo:      document.body,
          onChange(dates: Date[]) {
            if (!dates[0]) return;
            const d    = new Date(dates[0]); d.setHours(0, 0, 0, 0);
            const next = new Date(d);        next.setDate(d.getDate() + 1);
            setCheckin(d);
            fpCo.current?.set("minDate", next);
            if (!fpCo.current?.selectedDates[0] || fpCo.current.selectedDates[0] <= d) {
              fpCo.current?.setDate(next, true);
            }
          },
        });

        fpCo.current = window.flatpickr(coInputRef.current, {
          dateFormat:    "d M Y",
          minDate:       tomorrow,
          disableMobile: true,
          appendTo:      document.body,
          onChange(dates: Date[]) {
            if (dates[0]) {
              const d = new Date(dates[0]); d.setHours(0, 0, 0, 0);
              setCheckout(d);
            }
          },
        });

        window.addEventListener("scroll", closeAll, { passive: true });
      } catch (e) {
        console.error("[BookingWidget]", e);
      }
    })();

    return () => {
      alive = false;
      window.removeEventListener("scroll", closeAll);
      fpCi.current?.destroy();
      fpCo.current?.destroy();
    };
  }, []);

  // ── Book Now ──────────────────────────────────────────────────────────────
  function handleBookNow() {
    const ci = fpCi.current?.selectedDates[0] ?? checkin;
    const co = fpCo.current?.selectedDates[0] ?? checkout;

    if (!ci) { alert("Please select a check-in date.");  return; }
    if (!co) { alert("Please select a check-out date."); return; }
    if (isMadurai && !roomType) { alert("Please select a room type."); return; }

    const form = document.getElementById("_resBBBox") as HTMLFormElement;
    if (!form) return;
    (document.getElementById("h_chkin")  as HTMLInputElement).value = forPost(ci);
    (document.getElementById("h_chkout") as HTMLInputElement).value = forPost(co);
    (document.getElementById("h_hotel")  as HTMLInputElement).value = property;
    (document.getElementById("h_room")   as HTMLInputElement).value = isMadurai ? roomType : "";
    form.action = `https://live.ipms247.com/booking/book-rooms-${property}`;
    form.submit();
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="kw-card">

        {/* Property tabs */}
        <div className="kw-tabs">
          {PROPERTIES.map(p => (
            <motion.button
              key={p.value}
              type="button"
              onClick={() => { setProperty(p.value); setRoomType(""); }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className={`kw-tab${property === p.value ? " kw-tab-active" : ""}`}
            >
              {p.shortLabel}
            </motion.button>
          ))}
        </div>

        <form id="_resBBBox" method="post" target="_blank">
          <div className="kw-form">
            <div className="kw-fields">

              {/* Room Type — Madurai only */}
              <AnimatePresence>
                {isMadurai && (
                  <motion.div
                    key="room"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.22 }}
                    className="kw-group"
                  >
                    <label className="kw-label">Room Type</label>
                    <div className="kw-wrap">
                      <select className="kw-input" value={roomType} onChange={e => setRoomType(e.target.value)}>
                        <option value="">Select room</option>
                        {MADURAI_ROOMS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                      <svg className="kw-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M4 6l4 4 4-4" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Check In */}
              <div className="kw-group">
                <label className="kw-label">Check In</label>
                <div className="kw-wrap">
                  <input
                    ref={ciInputRef}
                    type="text"
                    readOnly
                    placeholder="Select date"
                    className="kw-input kw-fp"
                  />
                  <svg className="kw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="3" /><path d="M3 9h18M8 2v4M16 2v4" />
                  </svg>
                </div>
              </div>

              {/* Check Out */}
              <div className="kw-group">
                <label className="kw-label">Check Out</label>
                <div className="kw-wrap">
                  <input
                    ref={coInputRef}
                    type="text"
                    readOnly
                    placeholder="Select date"
                    className="kw-input kw-fp"
                  />
                  <svg className="kw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="3" /><path d="M3 9h18M8 2v4M16 2v4" />
                  </svg>
                </div>
              </div>

              {/* Book Now */}
              <div className="kw-group kw-btn-group">
                <label className="kw-label" style={{ visibility: "hidden" }}>&nbsp;</label>
                <motion.button
                  type="button"
                  onClick={handleBookNow}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="kw-btn"
                >
                  Book Now
                </motion.button>
              </div>

            </div>
          </div>

          {/* Hidden POST fields */}
          <input type="hidden" id="h_chkin"  name="eZ_chkin" />
          <input type="hidden" id="h_chkout" name="eZ_chkout" />
          <input type="hidden" id="h_hotel"  name="select_hotel" value={property} />
          <input type="hidden" id="h_room"   name="roomtypeunkid" value="" />
          <input type="hidden" name="eZ_adult"  value="1" />
          <input type="hidden" name="eZ_child"  value="0" />
          <input type="hidden" name="eZ_Nights" value="1" />
          <input type="hidden" name="eZ_room"   value="1" />
          <input type="hidden" name="calformat"  value="dd-mm-yy" />
        </form>

      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  .kw-card {
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.28);
    overflow: visible;
    font-family: 'Inter', sans-serif;
  }

  .kw-tabs { display: flex; gap: 8px; padding: 22px 28px 0; }
  .kw-tab {
    padding: 7px 20px; border-radius: 8px; font-size: 13px; font-weight: 600;
    letter-spacing: 0.4px; border: 1.5px solid #E5E7EB; background: transparent;
    color: #374151; cursor: pointer; transition: all 0.2s ease;
    font-family: 'Inter', sans-serif;
  }
  .kw-tab:hover    { border-color: var(--color-secondary-dark); color: var(--color-secondary-dark); }
  .kw-tab-active, .kw-tab-active:hover { background: var(--color-secondary-dark); color: #fff; border-color: var(--color-secondary-dark); box-shadow: 0 2px 8px rgba(82,100,66,0.25); }

  .kw-form   { padding: 16px 28px 28px; }
  .kw-fields { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 14px; }
  @media (min-width: 1024px) { .kw-fields { flex-wrap: nowrap; } }

  .kw-group     { flex: 1 1 0; min-width: 148px; display: flex; flex-direction: column; gap: 7px; position: relative; }
  .kw-btn-group { flex: 0 0 auto; min-width: 148px; }

  .kw-label {
    display: block; font-size: 11.5px; font-weight: 600; color: #374151;
    text-transform: uppercase; letter-spacing: 0.7px; white-space: nowrap;
    text-align: left; font-family: 'Inter', sans-serif;
  }

  .kw-wrap  { position: relative; width: 100%; }
  .kw-input {
    width: 100%; height: 46px; padding: 0 38px 0 14px;
    border: 1.5px solid #E5E7EB; border-radius: 10px; font-size: 14px;
    font-family: 'Inter', sans-serif; color: #1e293b; background: #F9FAFB;
    outline: none; cursor: pointer; appearance: none; -webkit-appearance: none;
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
  }
  .kw-input:hover  { border-color: var(--color-secondary-dark); background: #fff; }
  .kw-input:focus  { border-color: var(--color-secondary-dark); background: #fff; box-shadow: 0 0 0 3px rgba(82,100,66,0.12); }
  .kw-input::placeholder { color: #9CA3AF; font-size: 13px; }
  .kw-fp { cursor: pointer; }

  .kw-icon {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    color: var(--color-secondary-dark); pointer-events: none; width: 14px; height: 14px;
  }

  .kw-btn {
    width: 100%; height: 46px; padding: 0 20px; background: #081A2B; color: #fff;
    border: none; border-radius: 10px; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.18s, box-shadow 0.18s; white-space: nowrap;
  }
  .kw-btn:hover { background: #0d2a42; box-shadow: 0 8px 20px -4px rgba(8,26,43,0.45); }

  @media (max-width: 900px) {
    .kw-tabs { padding: 18px 20px 0; }
    .kw-form { padding: 14px 20px 22px; }
    .kw-btn-group { flex: 1 1 100%; }
  }
  @media (max-width: 600px) {
    .kw-tabs { padding: 16px 16px 0; }
    .kw-form { padding: 12px 16px 18px; }
    .kw-fields { flex-direction: column; gap: 12px; }
    .kw-group  { min-width: 100% !important; }
    .kw-input, .kw-btn { height: 50px; font-size: 15px; }
  }

  /* ── Flatpickr brand overrides ────────────────────────────────────────── */
  .flatpickr-calendar {
    border-radius: 16px !important;
    box-shadow: 0 20px 50px -8px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.08) !important;
    border: none !important;
    font-family: 'Inter', sans-serif !important;
  }
  .flatpickr-calendar.arrowTop:before,
  .flatpickr-calendar.arrowTop:after { display: none !important; }

  .flatpickr-months,
  .flatpickr-month { background: var(--color-primary) !important; }
  .flatpickr-months { border-radius: 14px 14px 0 0 !important; }

  .flatpickr-current-month,
  .flatpickr-current-month .flatpickr-monthDropdown-months,
  .flatpickr-current-month input.cur-year {
    color: #ffffff !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    background: transparent !important;
  }

  .flatpickr-prev-month, .flatpickr-next-month {
    fill: #ffffff !important; color: #ffffff !important;
  }
  .flatpickr-prev-month:hover svg, .flatpickr-next-month:hover svg {
    fill: var(--color-secondary) !important;
  }

  .flatpickr-weekdays { background: var(--color-primary) !important; }
  .flatpickr-weekday  {
    background: var(--color-primary) !important;
    color: rgba(255,255,255,0.45) !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 10px !important; font-weight: 700 !important;
    text-transform: uppercase !important;
  }

  .flatpickr-day {
    font-family: 'Inter', sans-serif !important;
    font-size: 13px !important;
    border-radius: 7px !important;
    color: #1e293b !important;
    border: none !important;
  }
  .flatpickr-day:hover, .flatpickr-day.prevMonthDay:hover, .flatpickr-day.nextMonthDay:hover {
    background: var(--color-secondary-bg) !important;
    color: var(--color-secondary-dark) !important;
    border: none !important;
  }
  .flatpickr-day.selected, .flatpickr-day.selected:hover {
    background: var(--color-primary) !important;
    color: var(--color-secondary) !important;
    border: none !important;
    font-weight: 700 !important;
  }
  .flatpickr-day.today {
    border: 2px solid var(--color-secondary) !important;
    color: var(--color-secondary-dark) !important;
    font-weight: 700 !important;
    background: transparent !important;
  }
  .flatpickr-day.today:hover {
    background: var(--color-secondary-bg) !important;
    border-color: var(--color-secondary) !important;
  }
  .flatpickr-day.disabled, .flatpickr-day.disabled:hover,
  .flatpickr-day.prevMonthDay, .flatpickr-day.nextMonthDay {
    color: rgba(0,0,0,0.18) !important;
    background: transparent !important;
    cursor: default !important;
  }
  .flatpickr-day.inRange {
    background: var(--color-secondary-bg) !important;
    color: var(--color-secondary-dark) !important;
    border: none !important;
    box-shadow: none !important;
  }
`;
