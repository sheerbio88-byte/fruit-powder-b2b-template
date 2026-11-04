// Visible home "Key facts" block. Mirrors the "## Key facts" section of /llms.txt.
// Every line restates content already published on this site (FAQ, schema, hub copy) — do not add
// numbers, certifications, contact details, MOQs, or lead times that are not already on the site.
export interface KeyFact {
  label: string;
  text: string;
  href?: string;
  linkText?: string;
}

export const KEY_FACTS: KeyFact[] = [
  {"label": "Who we are", "text": "Supplier of fruit and vegetable powders, integrating R&D, production, and sales for food, beverage, health product, catering, and consumer brands."},
  {"label": "Lines", "text": "Fruit powder, vegetable powder, freeze-dried fruit powder, plant-based protein, instant tea powder, greens, dried fruit, and dried vegetables."},
  {"label": "Packing", "text": "Where a product page publishes packing, some items list 1–5 kg aluminum foil bags and 25 kg cardboard drums, stored sealed, dry, and away from light."},
  {"label": "OEM", "text": "Custom ingredient and finished-form programs are quoted from the OEM page.", "href": "/services/", "linkText": "OEM"},
  {"label": "Request a quote", "text": "Share the product, specification, and volume.", "href": "/contact/#inquiry-form", "linkText": "Inquiry form"},
];
