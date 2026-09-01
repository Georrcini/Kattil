import Amenity from "../lib/models/Amenity";

export async function seedAmenities() {
  // Remove old amenities (category-based) and replace with homepage amenities
  await Amenity.deleteMany({});

  const amenities = [
    { name: "Bunk Bed",         icon: "BedDouble",       visible: true, order: 0 },
    { name: "Locker",           icon: "LockKeyhole",     visible: true, order: 1 },
    { name: "High Speed Wi-Fi", icon: "Wifi",            visible: true, order: 2 },
    { name: "Paid Breakfast",   icon: "Coffee",          visible: true, order: 3 },
    { name: "Free Parking",     icon: "SquareParking",   visible: true, order: 4 },
    { name: "Laundry Service",  icon: "WashingMachine",  visible: true, order: 5 },
    { name: "Pet Friendly",     icon: "PawPrint",        visible: true, order: 6 },
    { name: "Kitchen",          icon: "ChefHat",         visible: true, order: 7 },
    { name: "Airport Shuttle",  icon: "Plane",           visible: true, order: 8 },
  ];

  await Amenity.insertMany(amenities);
  console.log(`Amenities: ${amenities.length} created (replaced previous)`);
}
