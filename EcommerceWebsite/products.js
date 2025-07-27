// Products data
const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 99.99,
    oldPrice: 129.99,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    isNew: true,
    discount: 23,
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    description: "Track your fitness and stay connected with this smart watch",
    price: 199.99,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    isNew: true,
  },

  {
    id: 5,
    name: "Men's Casual T-Shirt",
    description: "Comfortable cotton t-shirt for everyday wear",
    price: 24.99,
    oldPrice: 34.99,
    category: "clothing",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    discount: 29,
  },
  {
    id: 6,
    name: "Women's Summer Dress",
    description: "Lightweight and breathable summer dress",
    price: 49.99,
    category: "clothing",
    image:
      "https://images.unsplash.com/photo-1542295669297-4d352b042bca?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    isNew: true,
  },
  {
    id: 7,
    name: "Running Shoes",
    description: "High-performance running shoes with cushioned soles",
    price: 89.99,
    oldPrice: 109.99,
    category: "clothing",
    image:
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    discount: 18,
  },
  {
    id: 8,
    name: "Denim Jacket",
    description: "Classic denim jacket for men and women",
    price: 59.99,
    category: "clothing",
    image:
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 9,
    name: "Non-Stick Cookware Set",
    description: "10-piece non-stick cookware set for your kitchen",
    price: 149.99,
    oldPrice: 199.99,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    discount: 25,
  },
  {
    id: 10,
    name: "Air Fryer",
    description: "Digital air fryer with multiple cooking functions",
    price: 119.99,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1611791484670-ce19b801d192?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    isNew: true,
  },
  {
    id: 11,
    name: "Memory Foam Pillow",
    description: "Orthopedic memory foam pillow for better sleep",
    price: 39.99,
    oldPrice: 49.99,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    discount: 20,
  },
  {
    id: 12,
    name: "Robot Vacuum Cleaner",
    description: "Smart robot vacuum with app control and automatic charging",
    price: 299.99,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 13,
    name: "Facial Cleansing Brush",
    description: "Electric facial cleansing brush with multiple brush heads",
    price: 49.99,
    oldPrice: 69.99,
    category: "beauty",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    discount: 29,
  },
  {
    id: 14,
    name: "Hair Dryer",
    description: "Professional hair dryer with ionic technology",
    price: 79.99,
    category: "beauty",
    image:
      "https://images.unsplash.com/photo-1519735777090-ec97162dc266?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    isNew: true,
  },
  {
    id: 15,
    name: "Makeup Brush Set",
    description: "12-piece professional makeup brush set",
    price: 34.99,
    oldPrice: 44.99,
    category: "beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    discount: 22,
  },
  {
    id: 16,
    name: "LED Makeup Mirror",
    description: "Lighted makeup mirror with adjustable brightness",
    price: 59.99,
    category: "beauty",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 17,
    name: "Gaming Laptop",
    description: "High-performance gaming laptop with RGB keyboard",
    price: 1299.99,
    oldPrice: 1499.99,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    discount: 13,
  },
  {
    id: 18,
    name: "Wireless Gaming Mouse",
    description: "Ergonomic wireless mouse with customizable buttons",
    price: 69.99,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    isNew: true,
  },
  {
    id: 19,
    name: "Yoga Mat",
    description: "Non-slip yoga mat with carrying strap",
    price: 29.99,
    oldPrice: 39.99,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    discount: 25,
  },
  {
    id: 20,
    name: "Resistance Bands Set",
    description: "5-piece resistance bands set for home workouts",
    price: 24.99,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
];
