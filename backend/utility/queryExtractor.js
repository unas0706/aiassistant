const nlp = require("compromise");
const stringSimilarity = require("string-similarity");

// Product database with features
const products = [
  {
    name: "Premium Wireless Headphones",
    price: 199.99,
    category: "Electronics",
    color: ["Black"],
    features: ["Wireless", "Noise Cancelling", "Bluetooth"],
  },
  {
    name: "Smart Fitness Watch",
    price: 149.99,
    category: "Electronics",
    color: ["Black", "Silver"],
    features: ["Heart Rate Monitor", "GPS", "Waterproof"],
  },
  {
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    category: "Clothing",
    color: ["White", "Blue", "Black"],
    features: ["Organic", "Cotton", "Breathable"],
  },
  {
    name: "Running Shoes",
    price: 129.99,
    category: "Footwear",
    color: ["Blue", "Black", "Grey"],
    features: ["Lightweight", "Breathable", "Durable"],
  },
  {
    name: "Gaming Laptop",
    price: 1299.99,
    category: "Electronics",
    color: ["Black", "Red"],
    features: ["16GB RAM", "RTX 3060", "144Hz Display"],
  },
  {
    name: "Designer Sunglasses",
    price: 159.99,
    category: "Accessories",
    color: ["Black", "Gold"],
    features: ["UV Protection", "Polarized"],
  },
];

// Available attributes
const availableColors = ["black", "white", "blue", "red", "grey", "silver", "gold"];
const categories = [...new Set(products.map((p) => p.category.toLowerCase()))];
const availableFeatures = [...new Set(products.flatMap((p) => p.features.map(f => f.toLowerCase())))];

/**
 * Function to extract numerical features (e.g., "64GB RAM", "144Hz Display")
 */
function extractNumericFeatures(query) {
  const featureRegex = /(\d+)\s*(gb|hz|mhz|ram|rom|mah|mp)/gi;
  let matches = query.match(featureRegex);
  return matches ? matches.map(match => match.toUpperCase()) : [];
}

/**
 * Function to extract price constraints (e.g., "under 5000", "below 10k")
 */
function extractPriceConstraint(query) {
  const priceRegex = /(under|below|less than|upto)\s*(\d+)/i;
  let match = query.match(priceRegex);
  return match ? parseInt(match[2]) : null;
}

/**
 * Function to find product based on user query
 */
function findProduct(query) {
  let doc = nlp(query.toLowerCase());

  let extracted = {
    name: null,
    category: null,
    price: null,
    priceConstraint: extractPriceConstraint(query), // Detect max budget
    color: null,
    features: [],
  };

  // Extract colors
  let foundColors = availableColors.filter((color) => query.toLowerCase().includes(color));
  if (foundColors.length > 0) {
    extracted.color = foundColors.map((c) => c.charAt(0).toUpperCase() + c.slice(1));
  }

  // Extract category
  let categoryMatch = categories.find((c) => query.toLowerCase().includes(c));
  if (categoryMatch) {
    extracted.category = categoryMatch.charAt(0).toUpperCase() + categoryMatch.slice(1);
  }

  // Extract features (regular features)
  let foundFeatures = availableFeatures.filter((feature) => query.toLowerCase().includes(feature));
  if (foundFeatures.length > 0) {
    extracted.features = foundFeatures.map((f) => f.charAt(0).toUpperCase() + f.slice(1));
  }

  // Extract numeric features (e.g., "64GB RAM")
  let numericFeatures = extractNumericFeatures(query);
  extracted.features = [...new Set([...extracted.features, ...numericFeatures])];

  // Find best match for product name using string similarity
  let productNames = products.map((p) => p.name.toLowerCase());
  let bestMatch = stringSimilarity.findBestMatch(query.toLowerCase(), productNames);
  if (bestMatch.bestMatch.rating > 0.4) {
    let matchedProduct = products.find((p) => p.name.toLowerCase() === bestMatch.bestMatch.target);
    if (matchedProduct) {
      extracted.name = matchedProduct.name;
      extracted.category = matchedProduct.category;
      extracted.price = matchedProduct.price;
      extracted.color = extracted.color || matchedProduct.color[0];
      extracted.features = [...new Set([...extracted.features, ...matchedProduct.features])];
    }
  }

  return extracted;
}

// Example usage
console.log(findProduct("branded watches"));
