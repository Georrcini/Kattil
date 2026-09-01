"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, MapPin, Building, X } from "lucide-react";
import {
  AdminCard, AdminCardHeader, AdminCardContent,
  AdminCardTitle, AdminCardDescription,
} from "@/components/admin/ui/AdminCard";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminButton from "@/components/admin/ui/AdminButton";
import { AdminInput, AdminTextarea } from "@/components/admin/ui/AdminInput";
import PageHeader from "@/components/admin/ui/PageHeader";
import AdminModal from "@/components/admin/ui/AdminModal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";

const EASE = [0.22, 1, 0.36, 1] as const;

interface City {
  _id: string;
  name: string;
  slug: string;
  label?: string;
  description?: string;
  banner?: string;
  address?: string;
  phone?: string;
  email?: string;
  mapSrc?: string;
  active: boolean;
  order: number;
  seo?: { title?: string; description?: string; keywords?: string; ogImage?: string };
}

const EMPTY_FORM: Omit<City, "_id"> = {
  name: "", slug: "", label: "", description: "", banner: "",
  address: "", phone: "", email: "", mapSrc: "",
  active: true, order: 0,
  seo: { title: "", description: "", keywords: "", ogImage: "" },
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

const GRADIENT_PAIRS = [
  "from-[#0d1b2e] to-[#3a5535]",       // deep navy → dark sage
  "from-[#526442] to-[#9CAF88]",        // dark sage → sage green
  "from-[#162840] to-[#526442]",        // medium navy → sage
  "from-[#3d6080] to-[#9CAF88]",        // mid navy → sage green
];

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "contact" | "seo">("basic");

  const fetchCities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cities?limit=100").then((r) => r.json());
      if (res.success) setCities(res.data.cities);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCities(); }, [fetchCities]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingCity(null); setActiveTab("basic"); setIsModalOpen(true); };
  const openEdit = (city: City) => { setForm({ ...city }); setEditingCity(city); setActiveTab("basic"); setIsModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editingCity ? `/api/admin/cities/${editingCity._id}` : "/api/admin/cities";
      const method = editingCity ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }).then((r) => r.json());
      if (res.success) { setIsModalOpen(false); fetchCities(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/cities/${deleteId}`, { method: "DELETE" }).then((r) => r.json());
    if (!res.success) { alert(res.error); } else { fetchCities(); }
    setDeleteId(null);
  };

  return (
    <div>
      <PageHeader title="Cities" subtitle="Manage hotel locations">
        <AdminButton onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add City
        </AdminButton>
      </PageHeader>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 rounded-3xl adm-skeleton" />
          ))}
        </div>
      ) : cities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[hsl(var(--adm-border))] py-24"
        >
          <Building className="h-16 w-16 text-[hsl(var(--adm-muted-foreground)/0.3)] mb-4" />
          <p className="text-lg font-semibold text-[hsl(var(--adm-foreground))]">No cities yet</p>
          <p className="mt-1 text-sm text-[hsl(var(--adm-muted-foreground))]">Add your first hotel city to get started</p>
          <AdminButton onClick={openAdd} className="mt-4">
            <Plus className="h-4 w-4" /> Add City
          </AdminButton>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {cities.map((city, i) => (
            <motion.div
              key={city._id}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } } }}
              whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
              className="group"
            >
              <AdminCard className="overflow-hidden h-full">
                {/* Banner / Gradient */}
                <div className={`relative h-36 bg-gradient-to-br ${GRADIENT_PAIRS[i % GRADIENT_PAIRS.length]}`}>
                  {city.banner && (
                    <img src={city.banner} alt={city.name} className="absolute inset-0 h-full w-full object-cover opacity-60" />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-white/20 p-1.5 backdrop-blur-sm">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/80">/{city.slug}</span>
                    </div>
                  </div>
                  {/* Action buttons — visible on hover */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => openEdit(city)}
                      className="rounded-lg bg-white/90 p-1.5 text-[hsl(var(--adm-foreground))] shadow-sm hover:bg-white transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(city._id)}
                      className="rounded-lg bg-white/90 p-1.5 text-[hsl(var(--adm-destructive))] shadow-sm hover:bg-white transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-xl font-bold text-[hsl(var(--adm-card-foreground))]">{city.name}</h3>
                    <AdminBadge variant={city.active ? "success" : "destructive"}>
                      {city.active ? "Active" : "Inactive"}
                    </AdminBadge>
                  </div>
                  {city.description && (
                    <p className="text-sm text-[hsl(var(--adm-muted-foreground))] line-clamp-2">{city.description}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-[hsl(var(--adm-muted-foreground))]">Order: {city.order}</span>
                    <div className="flex gap-2">
                      <AdminButton variant="outline" size="sm" onClick={() => openEdit(city)}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </AdminButton>
                    </div>
                  </div>
                </div>
              </AdminCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCity ? "Edit City" : "Add City"} size="lg">
        <div className="mb-6 flex gap-1 rounded-xl border border-[hsl(var(--adm-border))] p-1">
          {(["basic", "contact", "seo"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold capitalize transition-colors ${
                activeTab === t ? "bg-[hsl(var(--adm-primary))] text-white" : "text-[hsl(var(--adm-muted-foreground))] hover:text-[hsl(var(--adm-foreground))]"
              }`}
            >
              {t === "basic" ? "Basic Info" : t === "contact" ? "Contact" : "SEO"}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {activeTab === "basic" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <AdminInput
                  label="City Name *"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                  placeholder="e.g. Chennai"
                />
                <AdminInput
                  label="Slug"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="auto-generated"
                />
              </div>
              <AdminTextarea
                label="Description"
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief description of this city/location"
              />
              <AdminInput
                label="Banner Image URL"
                value={form.banner ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, banner: e.target.value }))}
                placeholder="https://..."
              />
              {form.banner && (
                <img src={form.banner} alt="Banner preview" className="h-24 w-full rounded-xl object-cover border border-[hsl(var(--adm-border))]" />
              )}
              <div className="grid grid-cols-2 gap-4">
                <AdminInput
                  label="Display Order"
                  type="number"
                  value={String(form.order)}
                  onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                />
                <div className="flex items-center gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.active ? "bg-[hsl(var(--adm-primary))]" : "bg-[hsl(var(--adm-muted))]"}`}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${form.active ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <span className="text-sm text-[hsl(var(--adm-foreground))]">Active</span>
                </div>
              </div>
            </>
          )}
          {activeTab === "contact" && (
            <>
              <AdminInput
                label="Display Label"
                value={form.label ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="e.g. CHENNAI — shown as tab name on Contact page"
              />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput
                  label="Phone Number"
                  value={form.phone ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                />
                <AdminInput
                  label="Email Address"
                  value={form.email ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="location@kattilhotels.com"
                />
              </div>
              <AdminTextarea
                label="Full Address"
                value={form.address ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="274, 1st Main Road, Secretariat Colony, Thoraipakkam, Chennai, Tamil Nadu 600097"
              />
              <AdminInput
                label="Google Maps Embed URL"
                value={form.mapSrc ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, mapSrc: e.target.value }))}
                placeholder="https://maps.google.com/maps?q=...&output=embed"
              />
            </>
          )}
          {activeTab === "seo" && (
            <>
              <AdminInput label="SEO Title" value={form.seo?.title ?? ""} onChange={(e) => setForm((f) => ({ ...f, seo: { ...f.seo!, title: e.target.value } }))} placeholder="Page title for search engines" />
              <AdminTextarea label="Meta Description" value={form.seo?.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, seo: { ...f.seo!, description: e.target.value } }))} placeholder="Max 160 characters" />
              <AdminInput label="Keywords" value={form.seo?.keywords ?? ""} onChange={(e) => setForm((f) => ({ ...f, seo: { ...f.seo!, keywords: e.target.value } }))} placeholder="hotel, chennai, luxury rooms" />
              <AdminInput label="OG Image URL" value={form.seo?.ogImage ?? ""} onChange={(e) => setForm((f) => ({ ...f, seo: { ...f.seo!, ogImage: e.target.value } }))} placeholder="https://..." />
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[hsl(var(--adm-border)/0.4)] pt-4">
          <AdminButton variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</AdminButton>
          <AdminButton onClick={handleSave} loading={saving}>
            {editingCity ? "Save Changes" : "Create City"}
          </AdminButton>
        </div>
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete City"
        message="Are you sure? This will fail if rooms are still assigned to this city."
        variant="destructive"
        confirmLabel="Delete City"
      />
    </div>
  );
}
