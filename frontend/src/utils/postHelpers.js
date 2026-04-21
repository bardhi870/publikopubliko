export function getInitialFormData() {
  return {
    title: "",
    description: "",
    category: "",
    price: "",
    image_url: "",
    propertyType: "",
    listingType: "",
    priceType: "",
    city: "",
    area: "",
    rooms: "",
    bathrooms: "",
    phone: "",
    whatsapp: "",
    offerBadge: "",
    offerFeatures: [{ text: "", included: true }]
  };
}

export function formatDate(dateString) {
  if (!dateString) return "Pa datë";

  return new Date(dateString).toLocaleDateString("sq-AL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}