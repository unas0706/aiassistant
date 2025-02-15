const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("../models/Product");

const products = [
  {
    name: "Premium Wireless Headphones",
    price: 199.99,
    category: "Electronics",
    description:
      "Experience premium sound quality with our wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable ear cushions for extended listening sessions.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&q=80",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500&q=80",
    ],
    specs: [
      "Bluetooth 5.0",
      "Active Noise Cancellation",
      "30-hour Battery Life",
      "Quick Charging",
    ],
  },
  {
    name: "Smart Watch Series X",
    price: 299.99,
    category: "Electronics",
    description:
      "Stay connected and track your fitness with our advanced smartwatch. Features include heart rate monitoring, GPS tracking, and water resistance up to 50 meters.",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    ],
    specs: [
      "GPS + Cellular",
      "Heart Rate Monitor",
      "Water Resistant",
      "5-day Battery Life",
    ],
  },
  {
    name: "4K Ultra HD Camera",
    price: 599.99,
    category: "Electronics",
    description:
      "Capture stunning photos and videos with our professional-grade camera. Equipped with a 20MP sensor, 4K video capability, and advanced autofocus system.",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80",
      "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=500&q=80",
      "https://images.unsplash.com/photo-1480365501497-199581be0e66?w=500&q=80",
    ],
    specs: ["4K Video", "20MP Sensor", "Wi-Fi Connected", "Dual Card Slots"],
  },
  {
    name: "Wireless Gaming Mouse",
    price: 79.99,
    category: "Gaming",
    description:
      "Dominate your games with our high-precision wireless gaming mouse. Features customizable RGB lighting, programmable buttons, and ultra-low latency.",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80",
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=500&q=80",
    ],
    specs: [
      "16000 DPI Sensor",
      "Wireless",
      "RGB Lighting",
      "8 Programmable Buttons",
    ],
  },
  {
    name: "Mechanical Gaming Keyboard",
    price: 129.99,
    category: "Gaming",
    description:
      "Enhance your typing and gaming experience with our mechanical keyboard. Features Cherry MX switches, customizable backlighting, and durable aluminum construction.",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
      "https://images.unsplash.com/photo-1601445638532-7c64ef3a6df9?w=500&q=80",
    ],
    specs: [
      "Cherry MX Switches",
      "Full N-Key Rollover",
      "RGB Per-Key Lighting",
      "USB-C Connection",
    ],
  },
  {
    name: "Ultra HD Smart TV",
    price: 899.99,
    category: "Electronics",
    brand: "Samsung",
    color: ["Black", "Silver"],
    features: ["4K Resolution", "Smart Hub", "Voice Control", "HDR"],
    description:
      "Transform your home entertainment with this stunning 4K Smart TV. Features HDR technology, smart hub integration, and crystal-clear picture quality for an immersive viewing experience.",
    images: [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6",
      "https://images.unsplash.com/photo-1601944177325-f8867652837f",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79",
    ],
  },
  {
    name: "Premium Running Shoes",
    price: 129.99,
    category: "Footwear",
    brand: "Nike",
    color: ["Black/Red", "Blue/White", "Grey/Orange"],
    features: [
      "Breathable Mesh",
      "Cushioned Sole",
      "Lightweight",
      "Water Resistant",
    ],
    description:
      "Engineered for performance and comfort, these running shoes feature advanced cushioning technology, breathable mesh upper, and superior grip for optimal running experience.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2",
    ],
  },
  {
    name: "Wireless Gaming Mouse",
    price: 79.99,
    category: "Gaming",
    brand: "Logitech",
    color: ["Black", "White", "RGB"],
    features: ["16000 DPI", "Wireless", "Programmable Buttons", "RGB Lighting"],
    description:
      "Dominate your games with this high-performance wireless gaming mouse. Features customizable RGB lighting, programmable buttons, and ultra-precise sensor for competitive gaming.",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7",
      "https://images.unsplash.com/photo-1563297007-0686b7003af7",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
    ],
  },
  {
    name: "Designer Leather Handbag",
    price: 299.99,
    category: "Fashion",
    brand: "Michael Kors",
    color: ["Brown", "Black", "Tan"],
    features: ["Genuine Leather", "Multiple Compartments", "Adjustable Strap"],
    description:
      "A stylish and durable leather handbag designed to carry all your essentials in style.",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
      "https://images.unsplash.com/photo-1601987177651-8edfe6c20009",
    ],
  },
  {
    name: "Professional DSLR Camera",
    price: 1299.99,
    category: "Electronics",
    brand: "Canon",
    color: ["Black"],
    features: [
      "24MP Sensor",
      "4K Video",
      "WiFi Connectivity",
      "Weather Sealed",
    ],
    description:
      "Capture stunning photos and videos with this professional-grade DSLR camera. Equipped with a 24MP sensor, 4K video capability, and weather-sealed body for durability.",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
      "https://images.unsplash.com/photo-1519183071298-a2962feb14f4",
      "https://images.unsplash.com/photo-1515630278258-407f66498911",
    ],
  },
  {
    name: "Smart Fitness Watch",
    price: 199.99,
    category: "Electronics",
    brand: "Fitbit",
    color: ["Black", "Silver", "Rose Gold"],
    features: [
      "Heart Rate Monitor",
      "GPS Tracking",
      "Water Resistant",
      "Sleep Tracking",
    ],
    description:
      "Track your fitness and health with this advanced smartwatch. Features include heart rate monitoring, GPS tracking, water resistance, and sleep tracking.",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    ],
  },
  {
    name: "Wireless Earbuds",
    price: 159.99,
    category: "Electronics",
    brand: "Apple",
    color: ["White", "Black"],
    features: [
      "Active Noise Cancellation",
      "Water Resistant",
      "Touch Controls",
      "24hr Battery",
    ],
    description:
      "Experience true wireless freedom with these premium earbuds. Featuring active noise cancellation, touch controls, and long battery life for all-day listening comfort.",
    images: [
      "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
      "https://images.unsplash.com/photo-1598331668826-20cecc596b86",
      "https://images.unsplash.com/photo-1605464315542-bda3e2f4e605",
    ],
  },
  {
    name: "Gaming Laptop",
    price: 1499.99,
    category: "Electronics",
    brand: "Asus",
    color: ["Black", "Grey"],
    features: ["RTX 3070", "16GB RAM", "1TB SSD", "144Hz Display"],
    description:
      "Take your gaming to the next level with this powerful gaming laptop. Featuring the latest RTX graphics, high-refresh display, and premium cooling system for intense gaming sessions.",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2",
      "https://images.unsplash.com/photo-1537498425277-c283d32ef9db",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    ],
  },
  {
    name: "Mechanical Keyboard",
    price: 129.99,
    category: "Gaming",
    brand: "Corsair",
    color: ["Black", "White"],
    features: [
      "RGB Backlight",
      "Cherry MX Switches",
      "Aluminum Frame",
      "Macro Keys",
    ],
    description:
      "Enhance your gaming setup with this premium mechanical keyboard. Features Cherry MX switches, per-key RGB lighting, and aircraft-grade aluminum frame for durability.",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
      "https://images.unsplash.com/photo-1618384887929-16ec33dad2a1",
      "https://images.unsplash.com/photo-1595044426077-d36d9236d54a",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    ],
  },
  {
    name: "4K Monitor",
    price: 399.99,
    category: "Electronics",
    brand: "LG",
    color: ["Black"],
    features: ["4K Resolution", "HDR", "1ms Response Time", "FreeSync"],
    description:
      "Enjoy stunning 4K visuals and smooth gaming with this high-performance 4K monitor. Features HDR technology, 1ms response time, and FreeSync for seamless gaming.",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee9",
      "https://images.unsplash.com/photo-1602837385569-08ac19ec83af",
      "https://images.unsplash.com/photo-1593640495253-23196b27a87f",
    ],
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany({}); // Clear existing products
    await Product.insertMany(products);

    console.log("Products seeded successfully! 🌱");
    process.exit();
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
