"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Save, BedDouble } from "lucide-react";
import { motion } from "framer-motion";
import AdminDropzone from "@/components/admin/ui/AdminDropzone";

const EASE = [0.22, 1, 0.36, 1] as const;

interface City { _id: string; name: string; slug: string }

interface RoomForm {
  name: string;
  city: string;
  images: string[];
  status: "active" | "inactive" | "maintenance";
  link: string;
}

const EMPTY: RoomForm = {
  name: "",
  city: "",
  images: [],
  status: "active",
  link: "",
};

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
            images: d.images ?? [],
            status: d.status ?? "active",
            link: d.link ?? d.cta?.url ?? "",   // support rooms saved with old cta.url field
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSave = async () => {
    setError("");
    if (!form.name.trim()) { setError("Room name is required."); return; }
    if (!form.city) { setError("Please select a city."); return; }

    setSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        cityId: form.city,
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
                {isNew ? "Add New Room" : "Edit Room"}
              </h1>
              <p className="text-sm text-[hsl(var(--adm-muted-foreground))] mt-0.5">
                {isNew
                  ? "Fill in the details below to create a new room listing."
                  : "Update the room details. Changes go live immediately after saving."}
              </p>
            </div>
          </div>
        </div>

        {/* Form body */}
        <div className="px-6 py-6 space-y-8">

          {/* Section 1: Room Details */}
          <section>
            <SectionTitle>Room Details</SectionTitle>
            <div className="grid md:grid-cols-2 gap-5">
              <FormField
                label="Room Name"
                required
                hint="The public-facing name guests will see on the website (e.g., 'Deluxe Pod', 'Royal Suite')."
              >
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Deluxe Pod"
                  className="flex h-10 w-full rounded-lg border border-[hsl(var(--adm-input))] bg-[hsl(var(--adm-background))] px-3 text-sm text-[hsl(var(--adm-foreground))] placeholder:text-[hsl(var(--adm-muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--adm-ring))] transition-colors"
                />
              </FormField>

              <FormField
                label="City / Property"
                required
                hint="Which Kattil property does this room belong to? This determines where it appears in the rooms listing."
              >
                <select
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className="flex h-10 w-full rounded-lg border border-[hsl(var(--adm-input))] bg-[hsl(var(--adm-background))] px-3 text-sm text-[hsl(var(--adm-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--adm-ring))] transition-colors"
                >
                  <option value="">Select a property…</option>
                  {cities.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </FormField>
            </div>
          </section>

          {/* Section 2: Room Image */}
          <section>
            <SectionTitle>Room Image</SectionTitle>
            <div className="space-y-2">
              <AdminDropzone
                label="Primary Image"
                hint="The main photo guests see when browsing rooms. Use a high-quality landscape image (1200×800px or larger). Supports JPG, PNG, WebP — max 5 MB."
                value={form.images[0] ?? ""}
                onChange={(url) => setForm((f) => ({ ...f, images: url ? [url, ...f.images.slice(1)] : f.images.slice(1) }))}
              />
              <p className="text-xs text-[hsl(var(--adm-muted-foreground))]">
                Recommended size: <strong>1200 × 800 px</strong> (3:2 ratio) · Landscape works best.
              </p>
            </div>
          </section>

          {/* Section 3: Booking CTA */}
          <section>
            <SectionTitle>Booking Link</SectionTitle>
            <FormField
              label="Book Now URL"
              hint="The external booking URL for this room (e.g., your booking system link). Guests are redirected here when they click 'Book Now'."
            >
              <input
                type="url"
                value={form.link}
                onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                placeholder="https://live.ipms247.com/booking/..."
                className="flex h-10 w-full rounded-lg border border-[hsl(var(--adm-input))] bg-[hsl(var(--adm-background))] px-3 text-sm text-[hsl(var(--adm-foreground))] placeholder:text-[hsl(var(--adm-muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--adm-ring))] transition-colors"
              />
            </FormField>
          </section>

          {/* Error */}
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
                <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
              ) : (
                <><Save className="h-4 w-4" /> {isNew ? "Create Room" : "Save Changes"}</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
