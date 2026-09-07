"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Save, BedDouble, Plus, X, Check } from "lucide-react";
import { motion } from "framer-motion";
import AdminDropzone from "@/components/admin/ui/AdminDropzone";

const EASE = [0.22, 1, 0.36, 1] as const;

interface City {
  _id: string;
  name: string;
  slug: string;
}

interface RoomForm {
  name: string;
  city: string;
  badge: string;
  category: "deluxe" | "suite" | "standard" | "premium";
  amenities: string[];
  images: string[];
  status: "active" | "inactive" | "maintenance";
  link: string;
}

const EMPTY: RoomForm = {
  name: "",
  city: "",
  badge: "Private room",
  category: "deluxe",
  amenities: ["Free Wifi", "Restaurant"],
  images: [],
  status: "active",
  link: "",
};

const BADGE_PRESETS = [
  "Private room",
  "Home stay",
  "Deluxe Suite",
  "Standard Room",
  "Executive Stay",
  "Entire Apartment",
  "Dormitory",
];

const POPULAR_AMENITIES = [
  "Free Wifi",
  "Restaurant",
  "Air Conditioning",
  "Room Service",
  "Swimming Pool",
  "Free Parking",
  "Breakfast Included",
  "Smart TV",
  "Balcony",
  "24/7 Check-in",
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-bold uppercase tracking-wider text-[hsl(var(--adm-muted-foreground))] border-b border-[hsl(var(--adm-border)/0.5)] pb-3 mb-5">
      {children}
    </h2>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-xs text-[hsl(var(--adm-muted-foreground))] leading-relaxed">
      {children}
    </p>
  );
}

function FormField({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-sm font-medium text-[hsl(var(--adm-foreground))]">
        {label}
        {required && <span className="text-[hsl(var(--adm-destructive))]">*</span>}
      </label>
      {children}
      {hint && <FieldHint>{hint}</FieldHint>}
    </div>
  );
}

export default function RoomFormPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const [form, setForm] = useState<RoomForm>(EMPTY);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [customAmenity, setCustomAmenity] = useState("");

  useEffect(() => {
    fetch("/api/admin/cities?limit=100")
      .then((r) => r.json())
      .then((r) => r.success && setCities(r.data.cities));
  }, []);

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    fetch(`/api/admin/rooms/${id}`)
      .then((r) => r.json())
      .then((r) => {
        if (r.success) {
          const d = r.data;
          setForm({
            name: d.name ?? "",
            city: d.city?._id ?? d.city ?? "",
            badge: d.badge ?? "Private room",
            category: d.category ?? "deluxe",
            amenities: Array.isArray(d.amenities) && d.amenities.length > 0 ? d.amenities : ["Free Wifi", "Restaurant"],
            images: d.images ?? [],
            status: d.status ?? "active",
            link: d.link ?? d.cta?.url ?? "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const addCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (trimmed && !form.amenities.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        amenities: [...prev.amenities, trimmed],
      }));
      setCustomAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const handleSave = async () => {
    setError("");
    if (!form.name.trim()) {
      setError("Room name is required.");
      return;
    }
    if (!form.city) {
      setError("Please select a destination / city property.");
      return;
    }

    setSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        cityId: form.city,
        badge: form.badge.trim() || "Private room",
        category: form.category,
        amenities: form.amenities,
        images: form.images,
        status: form.status,
        link: form.link.trim() || undefined,
      };
      const url = isNew ? "/api/admin/rooms" : `/api/admin/rooms/${id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => r.json());

      if (res.success) {
        router.push("/admin/rooms");
      } else {
        setError(res.error ?? res.message ?? "Failed to save. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--adm-muted-foreground))]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-2 px-1">
      {/* Back nav */}
      <button
        onClick={() => router.push("/admin/rooms")}
        className="flex items-center gap-1.5 text-sm text-[hsl(var(--adm-muted-foreground))] hover:text-[hsl(var(--adm-foreground))] transition-colors mb-5 group"
      >
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to Rooms
      </button>

      {/* Page card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="rounded-2xl border border-[hsl(var(--adm-border))] bg-[hsl(var(--adm-card))] shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[hsl(var(--adm-border)/0.5)]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl p-2.5 bg-[hsl(var(--adm-primary)/0.1)]">
              <BedDouble className="h-5 w-5 text-[hsl(var(--adm-primary))]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[hsl(var(--adm-foreground))]">
                {isNew ? "Add New Property / Room" : "Edit Property / Room"}
              </h1>
              <p className="text-sm text-[hsl(var(--adm-muted-foreground))] mt-0.5">
                {isNew
                  ? "Fill in the details below to add a property under a destination."
                  : "Update property details. Changes reflect immediately on the destination page."}
              </p>
            </div>
          </div>
        </div>

        {/* Form body */}
        <div className="px-6 py-6 space-y-8">
          {/* Section 1: Destination & Property Name */}
          <section>
            <SectionTitle>Property Details</SectionTitle>
            <div className="grid md:grid-cols-2 gap-5">
              <FormField
                label="Property / Room Name"
                required
                hint="e.g. 'Kattil Executive Stay', 'Kattil Stay', 'Royal Suite'"
              >
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Kattil Executive Stay"
                  className="flex h-10 w-full rounded-lg border border-[hsl(var(--adm-input))] bg-[hsl(var(--adm-background))] px-3 text-sm text-[hsl(var(--adm-foreground))] placeholder:text-[hsl(var(--adm-muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--adm-ring))] transition-colors"
                />
              </FormField>

              <FormField
                label="Destination / City"
                required
                hint="Which destination does this property belong to? (e.g. Madurai, Chennai, Coimbatore)"
              >
                <select
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className="flex h-10 w-full rounded-lg border border-[hsl(var(--adm-input))] bg-[hsl(var(--adm-background))] px-3 text-sm text-[hsl(var(--adm-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--adm-ring))] transition-colors"
                >
                  <option value="">Select a destination…</option>
                  {cities.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            {/* Property Type / Badge */}
            <div className="mt-5 space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--adm-foreground))]">
                Stay Type / Badge
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {BADGE_PRESETS.map((badge) => (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, badge }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      form.badge === badge
                        ? "bg-[hsl(var(--adm-primary))] text-white border-[hsl(var(--adm-primary))]"
                        : "bg-[hsl(var(--adm-background))] border-[hsl(var(--adm-border))] text-[hsl(var(--adm-foreground))] hover:border-[hsl(var(--adm-primary)/0.5)]"
                    }`}
                  >
                    {badge}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={form.badge}
                onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                placeholder="Or type custom type, e.g. Private room, Home stay"
                className="flex h-10 w-full rounded-lg border border-[hsl(var(--adm-input))] bg-[hsl(var(--adm-background))] px-3 text-sm text-[hsl(var(--adm-foreground))] placeholder:text-[hsl(var(--adm-muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--adm-ring))]"
              />
              <FieldHint>
                Shown directly above the property name on the destination card (e.g. <em>Private room</em>, <em>Home stay</em>).
              </FieldHint>
            </div>
          </section>

          {/* Section 2: Amenities & Features */}
          <section>
            <SectionTitle>Amenities & Pill Badges</SectionTitle>
            <div className="space-y-3">
              <FieldHint>
                Select the badges shown at the bottom of the property card (e.g. Free Wifi, Restaurant).
              </FieldHint>

              {/* Popular quick toggles */}
              <div className="flex flex-wrap gap-2">
                {POPULAR_AMENITIES.map((amenity) => {
                  const selected = form.amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selected
                          ? "bg-[hsl(var(--adm-primary)/0.15)] text-[hsl(var(--adm-primary))] border-[hsl(var(--adm-primary)/0.4)]"
                          : "bg-[hsl(var(--adm-background))] border-[hsl(var(--adm-border))] text-[hsl(var(--adm-muted-foreground))] hover:border-[hsl(var(--adm-primary)/0.4)]"
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                      {amenity}
                    </button>
                  );
                })}
              </div>

              {/* Custom amenity input */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomAmenity();
                    }
                  }}
                  placeholder="Add custom amenity (press Enter)..."
                  className="flex h-9 flex-1 rounded-lg border border-[hsl(var(--adm-input))] bg-[hsl(var(--adm-background))] px-3 text-xs text-[hsl(var(--adm-foreground))] placeholder:text-[hsl(var(--adm-muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--adm-ring))]"
                />
                <button
                  type="button"
                  onClick={addCustomAmenity}
                  className="px-3.5 py-1.5 rounded-lg bg-[hsl(var(--adm-primary))] text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {/* Current selected list */}
              {form.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {form.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[hsl(var(--adm-accent))] text-xs font-medium text-[hsl(var(--adm-foreground))]"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="hover:text-[hsl(var(--adm-destructive))] transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Section 3: Primary Photo */}
          <section>
            <SectionTitle>Property Photo</SectionTitle>
            <div className="space-y-2">
              <AdminDropzone
                label="Main Property Image"
                hint="Upload the main bedroom/property photo shown on the card. Recommended: 1200×800px (16:10 or 3:2 ratio)."
                value={form.images[0] ?? ""}
                onChange={(url) =>
                  setForm((f) => ({
                    ...f,
                    images: url ? [url, ...f.images.slice(1)] : f.images.slice(1),
                  }))
                }
              />
            </div>
          </section>

          {/* Section 4: Booking & View URL */}
          <section>
            <SectionTitle>View & Booking Action</SectionTitle>
            <FormField
              label="View / Book Now Link"
              hint="When guests click 'View →' on the property card, navigate to this URL (e.g., booking engine link or contact page)."
            >
              <input
                type="url"
                value={form.link}
                onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                placeholder="https://... or /contact-us or /rooms"
                className="flex h-10 w-full rounded-lg border border-[hsl(var(--adm-input))] bg-[hsl(var(--adm-background))] px-3 text-sm text-[hsl(var(--adm-foreground))] placeholder:text-[hsl(var(--adm-muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--adm-ring))] transition-colors"
              />
            </FormField>
          </section>

          {/* Section 5: Status */}
          <section>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    status: f.status === "active" ? "inactive" : "active",
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.status === "active"
                    ? "bg-[hsl(var(--adm-primary))]"
                    : "bg-[hsl(var(--adm-muted))]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    form.status === "active" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-[hsl(var(--adm-foreground))]">
                {form.status === "active"
                  ? "Active (Visible on destination page)"
                  : "Inactive (Hidden)"}
              </span>
            </div>
          </section>

          {/* Error message */}
          {error && (
            <div className="rounded-xl border border-[hsl(var(--adm-destructive)/0.3)] bg-[hsl(var(--adm-destructive)/0.08)] px-4 py-3">
              <p className="text-sm text-[hsl(var(--adm-destructive))]">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[hsl(var(--adm-border)/0.4)]">
            <button
              type="button"
              onClick={() => router.push("/admin/rooms")}
              className="h-10 rounded-lg border border-[hsl(var(--adm-border))] bg-transparent px-5 text-sm font-medium text-[hsl(var(--adm-foreground))] hover:bg-[hsl(var(--adm-accent)/0.4)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex h-10 items-center gap-2 rounded-lg px-6 text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{ background: "hsl(var(--adm-primary))" }}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> {isNew ? "Create Property" : "Save Changes"}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
