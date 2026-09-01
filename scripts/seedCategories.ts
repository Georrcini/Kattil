import BlogCategory from "../lib/models/BlogCategory";
import FaqCategory from "../lib/models/FaqCategory";

function slug(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
}

export async function seedCategories() {
  // Blog categories
  const blogCats = [
    "Travel Guide", "Wellness", "Dining", "Travel",
    "Nature", "Interiors", "Culture", "Tips",
  ];
  let blogNew = 0;
  for (let i = 0; i < blogCats.length; i++) {
    const name = blogCats[i];
    const s    = slug(name);
    const exists = await BlogCategory.findOne({ slug: s });
    if (!exists) {
      await BlogCategory.create({ name, slug: s, active: true, order: i });
      blogNew++;
      console.log(`  ✓ Blog category: ${name}`);
    } else {
      console.log(`  ↺ Blog category exists: ${name}`);
    }
  }
  console.log(`Blog categories: ${blogNew} created`);

  // FAQ categories
  const faqCats = ["Reservations", "Amenities", "Dining", "Policies", "General"];
  let faqNew = 0;
  for (let i = 0; i < faqCats.length; i++) {
    const name = faqCats[i];
    const s    = slug(name);
    const exists = await FaqCategory.findOne({ slug: s });
    if (!exists) {
      await FaqCategory.create({ name, slug: s, active: true, order: i });
      faqNew++;
      console.log(`  ✓ FAQ category: ${name}`);
    } else {
      console.log(`  ↺ FAQ category exists: ${name}`);
    }
  }
  console.log(`FAQ categories: ${faqNew} created`);
}
