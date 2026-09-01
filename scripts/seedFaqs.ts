import Faq from "../lib/models/Faq";

export async function seedFaqs() {
  const faqs = [
    // Reservations
    {
      category: "Reservations",
      question: "How do I make a reservation at Kattil?",
      answer:
        "You can book directly through our website, call us at +91 74487 49779, or use any of our authorised booking partners. We recommend booking at least two weeks in advance to secure your preferred room.",
      status: "active",
      displayOrder: 0,
    },
    {
      category: "Reservations",
      question: "Can I modify my reservation after booking?",
      answer:
        "Yes, modifications are welcome up to 72 hours before your arrival date, subject to availability. Please contact our reservations team directly for assistance.",
      status: "active",
      displayOrder: 1,
    },
    {
      category: "Reservations",
      question: "Is a deposit required to confirm my booking?",
      answer:
        "A deposit of 30% of the total booking value is required to confirm your reservation. The balance is due at check-in. Special packages may have different deposit requirements.",
      status: "active",
      displayOrder: 2,
    },
    {
      category: "Reservations",
      question: "Do you accommodate group bookings?",
      answer:
        "Absolutely. For groups of 6 rooms or more, we offer tailored packages and dedicated event coordination. Please contact our events team at events@kattil.com for a custom quote.",
      status: "active",
      displayOrder: 3,
    },
    // Amenities
    {
      category: "Amenities",
      question: "What amenities are included with my room?",
      answer:
        "All rooms include high-speed Wi-Fi, daily housekeeping, complimentary breakfast, 24/7 butler service, and access to our pool and wellness areas. Specific inclusions vary by room category.",
      status: "active",
      displayOrder: 0,
    },
    {
      category: "Amenities",
      question: "Is the infinity pool open year-round?",
      answer:
        "Yes, our infinity pool is open every day from 6:00 AM to 10:00 PM. Pool towels and loungers are provided complimentary. Private pool sessions can be arranged upon request.",
      status: "active",
      displayOrder: 1,
    },
    {
      category: "Amenities",
      question: "Do you offer airport transfers?",
      answer:
        "Yes, we provide luxury vehicle airport transfers from Madurai and Trivandrum airports. Please request this service at least 24 hours before arrival when making your reservation.",
      status: "active",
      displayOrder: 2,
    },
    {
      category: "Amenities",
      question: "Is there parking available?",
      answer:
        "Complimentary secured parking is available for all in-house guests. Valet parking is also available on request.",
      status: "active",
      displayOrder: 3,
    },
    // Dining
    {
      category: "Dining",
      question: "What dining options does Kattil offer?",
      answer:
        "We offer an all-day dining restaurant featuring contemporary takes on Tamil Nadu's rich culinary heritage, a rooftop bar, and in-room dining available 24 hours. We celebrate seasonal, locally sourced produce.",
      status: "active",
      displayOrder: 0,
    },
    {
      category: "Dining",
      question: "Can you accommodate dietary restrictions?",
      answer:
        "Our culinary team is experienced in creating meals for all dietary requirements including vegetarian, vegan, gluten-free, Jain, and allergy-specific diets. Please inform us at the time of booking.",
      status: "active",
      displayOrder: 1,
    },
    {
      category: "Dining",
      question: "Are non-residents allowed to dine at Kattil?",
      answer:
        "Yes, our restaurant welcomes non-resident guests for lunch and dinner. Reservations are recommended, especially on weekends. Please call or email us to book a table.",
      status: "active",
      displayOrder: 2,
    },
    // Policies
    {
      category: "Policies",
      question: "What is your pet policy?",
      answer:
        "We welcome well-behaved pets in select rooms with prior notice. A refundable pet deposit of ₹2,000 applies. Please inform us at the time of booking so we can prepare your room accordingly.",
      status: "active",
      displayOrder: 0,
    },
    {
      category: "Policies",
      question: "Is smoking permitted on the property?",
      answer:
        "Kattil is a predominantly smoke-free property. Smoking is only permitted in designated outdoor areas. A deep-cleaning surcharge of ₹5,000 will apply for violations inside rooms.",
      status: "active",
      displayOrder: 1,
    },
    {
      category: "Policies",
      question: "What is the minimum age requirement for check-in?",
      answer:
        "Guests must be 18 years or older to check in independently. Guests under 18 must be accompanied by a parent or legal guardian. A valid government-issued photo ID is mandatory at check-in.",
      status: "active",
      displayOrder: 2,
    },
  ] as const;

  let inserted = 0;
  for (const faq of faqs) {
    const existing = await Faq.findOne({ question: faq.question });
    if (existing) {
      await Faq.findOneAndUpdate({ question: faq.question }, faq);
      console.log(`  ↺ FAQ updated: ${faq.question.slice(0, 55)}…`);
    } else {
      await Faq.create(faq);
      inserted++;
      console.log(`  ✓ FAQ created: ${faq.question.slice(0, 55)}…`);
    }
  }
  console.log(`FAQs: ${inserted} created, ${faqs.length - inserted} updated`);
}
