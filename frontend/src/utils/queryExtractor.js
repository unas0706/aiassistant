import nlp from 'compromise';

// Define categoryAliases object first
const categoryAliases = {
  'watches': [  // Add a dedicated watches category
    'watch', 'watches', 'smartwatch', 'smart watch', 
    'fitness watch', 'wristwatch', 'timepiece'
  ],
  'electronics': [
    'electronic', 'gadget', 'device', 'tech', 'technology',
    'phone', 'smartphone', 'mobile phone', 'cell phone',
    'headphone', 'headphones', 'earphone', 'earphones', 'earbuds',
    'camera', 'cameras', 'monitor', 'monitors', 'tv', 'television'
  ],
  'gaming': [
    'game', 'gamer', 'gaming gear', 'gaming accessories',
    'gaming mouse', 'gaming keyboard', 'gaming headset'
  ],
  'footwear': [
    'shoe', 'shoes', 'sneaker', 'sneakers', 'boot', 'boots',
    'footwear', 'running shoes', 'athletic shoes'
  ],
  'accessories': [
    'accessory', 'accessories', 'watch', 'watches',
    'bag', 'bags', 'handbag', 'handbags'
  ],
  'fashion': [
    'clothing', 'wear', 'apparel', 'clothes',
    'fashion', 'style', 'designer'
  ]
};

// Utility functions
function extractAvailableAttributes(products) {
  const categories = [...new Set(products.map(p => p.category.toLowerCase()))];
  const colors = [...new Set(products.flatMap(p => p.color?.map(c => c.toLowerCase()) || []))];
  const features = [...new Set(products.flatMap(p => p.features?.map(f => f.toLowerCase()) || []))];
  
  return { categories, colors, features };
}

function extractNumericFeatures(query) {
  const featureRegex = /(\d+)\s*(gb|hz|mhz|ram|rom|mah|mp|fps|inch|"|tb)/gi;
  let matches = query.match(featureRegex);
  return matches ? matches.map(match => match.toUpperCase()) : [];
}

function extractPriceConstraint(query) {
  const priceRegex = /(under|below|less than|upto|cheaper than)\s*\$?\s*(\d+)/i;
  let match = query.match(priceRegex);
  return match ? parseInt(match[2]) : null;
}

function findCategory(query, categories) {
  const doc = nlp(query);
  
  // Get nouns and adjectives from query
  const terms = [...new Set([
    ...doc.nouns().out('array'),
    ...doc.adjectives().out('array')
  ])];

  // Check for direct category matches
  const directMatch = categories.find(cat => 
    terms.some(term => term.toLowerCase().includes(cat.toLowerCase()))
  );
  if (directMatch) return directMatch;

  // Check category aliases
  for (const [category, aliases] of Object.entries(categoryAliases)) {
    if (aliases.some(alias => 
      terms.some(term => 
        term.toLowerCase().includes(alias.toLowerCase()) ||
        alias.toLowerCase().includes(term.toLowerCase())
      )
    )) {
      return category;
    }
  }

  return null;
}

// Add this new function to extract product name
function extractProductName(query, products) {
  const doc = nlp(query);
  
  // Get nouns from the query
  const nouns = doc.nouns().out('array');
  
  // Find products that match any of the nouns
  let bestMatch = {
    product: null,
    matchCount: 0,
    priority: 0
  };

  products.forEach(product => {
    const productDoc = nlp(product.name);
    const productNouns = productDoc.nouns().out('array');
    
    // Count matching nouns
    const matches = nouns.filter(noun => 
      productNouns.some(pNoun => 
        pNoun.toLowerCase().includes(noun.toLowerCase()) ||
        noun.toLowerCase().includes(pNoun.toLowerCase())
      )
    ).length;

    // Check for exact matches in product name
    const exactMatch = product.name.toLowerCase().includes(query.toLowerCase());
    
    // Update best match if this product has more matches or is an exact match
    if (exactMatch || matches > bestMatch.matchCount) {
      bestMatch = {
        product: product,
        matchCount: matches,
        priority: exactMatch ? 2 : 1
      };
    }
  });

  return bestMatch.product?.name || null;
}

// Main export function
export function findProducts(query, products) {
  const { categories, colors, features } = extractAvailableAttributes(products);
  const doc = nlp(query);

  // Extract product name
  const productName = extractProductName(query, products);

  let extracted = {
    name: productName,
    category: null,
    price: null,
    priceConstraint: extractPriceConstraint(query),
    color: null,
    features: [],
  };

  // If we found a product name, prioritize exact matches
  if (productName) {
    const exactMatches = products.filter(p => {
      const productDoc = nlp(p.name);
      const queryDoc = nlp(query);
      
      // Check if product terms match query terms
      const productTerms = productDoc.terms().out('array');
      const queryTerms = queryDoc.terms().out('array');
      
      return productTerms.some(pTerm => 
        queryTerms.some(qTerm => 
          pTerm.toLowerCase().includes(qTerm.toLowerCase()) ||
          qTerm.toLowerCase().includes(pTerm.toLowerCase())
        )
      );
    });
    
    if (exactMatches.length > 0) {
      return {
        query: extracted,
        matches: exactMatches
      };
    }
  }

  // Extract category and other attributes
  extracted.category = findCategory(query, categories);

  // Extract colors using NLP
  const colorTerms = doc.match('#Color').out('array');
  const foundColors = colors.filter(color => 
    colorTerms.some(term => 
      color.toLowerCase().includes(term.toLowerCase())
    )
  );
  if (foundColors.length > 0) {
    extracted.color = foundColors;
  }

  // Extract features using NLP
  const featureTerms = doc.match('#Noun').out('array');
  const foundFeatures = features.filter(feature =>
    featureTerms.some(term =>
      feature.toLowerCase().includes(term.toLowerCase())
    )
  );
  
  extracted.features = [...new Set([
    ...foundFeatures,
    ...extractNumericFeatures(query)
  ])];

  // Score and match products
  let matchingProducts = products.map(product => {
    let score = 0;
    let matches = true;

    // Name matching using NLP
    const productDoc = nlp(product.name);
    const queryDoc = nlp(query);
    
    const sharedTerms = productDoc.terms().out('array')
      .filter(pTerm => 
        queryDoc.terms().out('array')
          .some(qTerm => qTerm.toLowerCase().includes(pTerm.toLowerCase()))
      ).length;
    
    score += sharedTerms * 2;

    // Category matching
    if (extracted.category && 
        product.category.toLowerCase() === extracted.category.toLowerCase()) {
      score += 3;
    }

    // Price constraint
    if (extracted.priceConstraint) {
      if (product.price <= extracted.priceConstraint) {
        score += 2;
      } else {
        matches = false;
      }
    }

    // Color and feature matching remain the same
    // ... existing color and feature matching code ...

    return { product, score, matches };
  });

  // Filter and sort results
  matchingProducts = matchingProducts
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);

  return {
    query: extracted,
    matches: matchingProducts
  };
} 