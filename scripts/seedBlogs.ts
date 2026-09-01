import Blog from "../lib/models/Blog";

export async function seedBlogs() {
  const blogs = [
    {
      title: "The Architecture of Silence: Designing Lumière",
      slug: "architecture-of-silence",
      category: "TRAVEL GUIDE",
      readTime: "12 Min Read",
      date: "April 2025",
      excerpt:
        "How thoughtful spatial design can transform a room into a sanctuary — our design philosophy explored.",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
      featured: true,
      status: "published",
      content: `<p>True architecture is not merely the arrangement of walls and windows — it is the careful curation of silence, of the space between things, of what is left unsaid in stone and light.</p>
<p>At Kattil, we believe that true luxury is not about opulent surroundings, but about creating meaningful experiences that resonate long after your stay.</p>
<h2>Traditional construction doesn't just define the silhouette. It shapes the experience.</h2>
<p>Our commitment to excellence is reflected in every detail — from the carefully curated rooms to the personalized service provided by our dedicated team. We source the finest materials, partner with world-renowned chefs, and invest in continuous training to ensure our staff delivers nothing short of perfection.</p>
<h2>The Geometry of Light</h2>
<p>Light, when handled with precision, becomes both architect and artist. In our suites, we've positioned windows not merely for view but for the way afternoon sun carves shadows across the hand-plastered walls, creating a living artwork that changes hour by hour.</p>
<p>Each room orientation was studied across different seasons and times of day. The morning light that enters the Garden Suite at precisely 7:14am was not an accident — it was a six-month conversation between our designers and the landscape itself.</p>
<h2>Creating Slow Transitions</h2>
<p>From the moment you step through our entrance, we want time to decelerate. The lobby is deliberately unhurried — there is no check-in counter in the traditional sense, only a quiet conversation over local tea while your details are handled seamlessly in the background.</p>`,
      order: 0,
    },
    {
      title: "Rituals of the Self: Morning at the Spa",
      slug: "rituals-of-the-self-morning-spa",
      category: "WELLNESS",
      readTime: "8 Min Read",
      date: "March 2025",
      excerpt: "A guide to the ancient wellness traditions that inform our spa programme.",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
      featured: false,
      status: "published",
      content: "<p>Our spa programme is rooted in centuries-old Tamil wellness traditions, reimagined for the contemporary traveller seeking restoration.</p>",
      order: 1,
    },
    {
      title: "The Art of Local Cuisine",
      slug: "art-of-local-cuisine",
      category: "DINING",
      readTime: "6 Min Read",
      date: "March 2025",
      excerpt: "How our culinary team transforms Tamil Nadu's seasonal harvest into an art form.",
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
      featured: false,
      status: "published",
      content: "<p>Every dish at Kattil begins with a walk through the local market — our chefs speak directly with farmers, fishermen, and foragers before the day's menu is written.</p>",
      order: 2,
    },
    {
      title: "The Slow Travel Manifesto",
      slug: "the-slow-travel-manifesto",
      category: "TRAVEL",
      readTime: "10 Min Read",
      date: "February 2025",
      excerpt: "In defense of staying longer, exploring deeper, and resisting the itinerary.",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
      featured: false,
      status: "published",
      content: "<p>Speed is the enemy of understanding. When we race through a place, we collect impressions but never earn insight.</p>",
      order: 3,
    },
    {
      title: "Gardens at Dusk",
      slug: "gardens-at-dusk",
      category: "NATURE",
      readTime: "5 Min Read",
      date: "February 2025",
      excerpt:
        "An evening walk through Kattil's gardens reveals a world lit by fireflies and scented blooms.",
      image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
      featured: false,
      status: "published",
      content: "<p>At dusk, the garden transforms. The aggressive heat of the Tamil midday softens into something golden and forgiving, and the jasmine — which has been gathering courage all day — releases itself into the air.</p>",
      order: 4,
    },
    {
      title: "Linen and Light",
      slug: "linen-and-light",
      category: "INTERIORS",
      readTime: "7 Min Read",
      date: "January 2025",
      excerpt:
        "The textile story behind Kattil's rooms — sourced from weavers in the Western Ghats.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      featured: false,
      status: "published",
      content: "<p>Every thread in our rooms has a provenance. We spent eighteen months tracing the supply chain of traditional South Indian textiles before settling on a partnership with a small cooperative in the Nilgiris.</p>",
      order: 5,
    },
  ];

  let inserted = 0;
  for (const blog of blogs) {
    const existing = await Blog.findOne({ slug: blog.slug });
    if (existing) {
      await Blog.findOneAndUpdate({ slug: blog.slug }, blog);
      console.log(`  ↺ Blog updated: ${blog.title}`);
    } else {
      await Blog.create(blog);
      inserted++;
      console.log(`  ✓ Blog created: ${blog.title}`);
    }
  }
  console.log(`Blogs: ${inserted} created, ${blogs.length - inserted} updated`);
}
