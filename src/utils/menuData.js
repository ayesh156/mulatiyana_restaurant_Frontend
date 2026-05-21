/**
 * Shared menu data — single source of truth for MenuPage and ProductViewPage.
 * Replace with API call once backend is ready.
 */
export const MENU_ITEMS = [
  {
    id: 1,
    name: 'Chicken Kottu',
    category: 'Street Food',
    price: 850,
    calories: 620,
    prepTime: '15 min',
    isNew: false,
    description:
      'A Sri Lankan street-food classic — shredded roti stir-fried with spiced chicken, egg, vegetables and aromatic curry sauce. Crispy, hearty and utterly addictive.',
    ingredients: ['Roti', 'Chicken', 'Egg', 'Leeks', 'Carrot', 'Curry Sauce', 'Spices'],
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Mixed Fried Rice',
    category: 'Rice Dishes',
    price: 750,
    calories: 540,
    prepTime: '12 min',
    isNew: false,
    description:
      'Fragrant basmati rice wok-tossed with mixed vegetables, egg, soy sauce and a hint of sesame oil. A satisfying everyday favourite.',
    ingredients: ['Basmati Rice', 'Mixed Vegetables', 'Egg', 'Soy Sauce', 'Sesame Oil', 'Spring Onion'],
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Seafood Noodles',
    category: 'Noodles',
    price: 1100,
    calories: 480,
    prepTime: '18 min',
    isNew: true,
    description:
      'Silky egg noodles tossed with fresh prawns, squid and fish in a light garlic-ginger sauce. A coastal Sri Lankan favourite with a modern twist.',
    ingredients: ['Egg Noodles', 'Prawns', 'Squid', 'Fish', 'Garlic', 'Ginger', 'Oyster Sauce'],
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Devilled Chicken',
    category: 'Mains',
    price: 950,
    calories: 590,
    prepTime: '20 min',
    isNew: true,
    description:
      'Tender chicken pieces flash-fried with capsicum, onion and a fiery devilled sauce. Bold, spicy and packed with flavour — not for the faint-hearted.',
    ingredients: ['Chicken', 'Capsicum', 'Onion', 'Tomato', 'Chilli', 'Devilled Sauce', 'Spices'],
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Prawn Curry',
    category: 'Mains',
    price: 1350,
    calories: 420,
    prepTime: '22 min',
    isNew: false,
    description:
      'Plump tiger prawns slow-cooked in a rich coconut milk curry with pandan, lemongrass and roasted spices. Best enjoyed with steamed rice.',
    ingredients: ['Tiger Prawns', 'Coconut Milk', 'Pandan', 'Lemongrass', 'Tomato', 'Roasted Spices'],
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    name: 'Vegetable Kottu',
    category: 'Street Food',
    price: 650,
    calories: 480,
    prepTime: '12 min',
    isNew: false,
    description:
      'The vegetarian take on our signature Kottu — shredded roti stir-fried with seasonal vegetables, egg and a fragrant curry sauce.',
    ingredients: ['Roti', 'Mixed Vegetables', 'Egg', 'Curry Sauce', 'Leeks', 'Spices'],
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    name: 'Watalappan',
    category: 'Desserts',
    price: 380,
    calories: 310,
    prepTime: '5 min',
    isNew: false,
    description:
      'A traditional Sri Lankan steamed coconut custard sweetened with kithul jaggery and perfumed with cardamom and nutmeg. Silky, rich and deeply comforting.',
    ingredients: ['Coconut Milk', 'Kithul Jaggery', 'Eggs', 'Cardamom', 'Nutmeg', 'Cashews'],
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 8,
    name: 'Egg Fried Noodles',
    category: 'Noodles',
    price: 720,
    calories: 510,
    prepTime: '10 min',
    isNew: false,
    description:
      'Classic egg noodles wok-fried with scrambled egg, spring onion and a savoury soy-based sauce. Simple, quick and deeply satisfying.',
    ingredients: ['Egg Noodles', 'Egg', 'Spring Onion', 'Soy Sauce', 'Garlic', 'Sesame Oil'],
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&auto=format&fit=crop&q=80',
  },
]

/** All unique categories derived from the data, prefixed with "All" */
export const CATEGORIES = ['All', ...new Set(MENU_ITEMS.map(i => i.category))]
