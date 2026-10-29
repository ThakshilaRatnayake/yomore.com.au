// ═══════════════════════════════════════════════════════════════════════
//  YO MORE – STAFF RECIPE BOOK: RECIPE DATA
//  This is the only file to edit when a recipe changes.
//
//  Each recipe:
//    name         flavour name shown on the card
//    ingredients  in the order they go in. Water first. The first one after
//                 Water is shown on the card as the "base".
//                 code is the product code (e.g. 'N702'). Leave it out if
//                 the product has none.
//    steps        the method, in order
// ═══════════════════════════════════════════════════════════════════════
window.RECIPES = [
  {
    name: 'Acai',
    ingredients: [
      { name: 'Water', qty: '5.7 L' },
      { name: 'Top Fruit Acai', code: 'N311', qty: '1 tub' }
    ],
    steps: [
      'Add water 5.7 L',
      'Add 1 tub Top Fruit Acai',
      'Mix well with the electric mixer'
    ]
  },
  {
    name: 'Signature Tart',
    ingredients: [
      { name: 'Water', qty: '3.8 L' },
      { name: 'Rubicone SoftYog LF', code: 'N710', qty: '1 bag' }
    ],
    steps: [
      'Add water 3.8 L',
      'Add 1 bag Rubicone SoftYog LF',
      'Mix well with the electric mixer'
    ]
  },
  {
    name: 'Creme Brulee',
    ingredients: [
      { name: 'Water', qty: '4 L' },
      { name: 'Rubicone SoftYoghurt Mild', code: 'N702', qty: '1 bag' },
      { name: 'Rubicone Crème Brûlée', code: 'F125', qty: '290 g' }
    ],
    steps: [
      'Add water 4 L',
      'Add 1 bag Rubicone SoftYoghurt Mild',
      'Add 290 g Rubicone Crème Brûlée',
      'Mix well with the electric mixer'
    ]
  },
  {
    name: 'Cookies & Cream',
    ingredients: [
      { name: 'Water', qty: '4 L' },
      { name: 'Rubicone SoftYoghurt Mild', code: 'N702', qty: '1 bag' },
      { name: 'Rubicone Romeo Paste', code: 'F033', qty: '230 g' },
      { name: 'Crushed Oreo', qty: '250 g' }
    ],
    steps: [
      'Add water 4 L',
      'Add 1 bag Rubicone SoftYoghurt Mild',
      'Add 230 g Rubicone Romeo Paste',
      'Add 250 g Crushed Oreo',
      'Mix well with the electric mixer'
    ]
  },
  {
    name: 'Biscoff',
    ingredients: [
      { name: 'Water', qty: '4.5 L' },
      { name: 'Rubicone SoftYoghurt Mild', code: 'N702', qty: '1 bag' },
      { name: 'Rubicone Speculoos Varieg', code: 'F361', qty: '460 g' },
      { name: 'Rubicone Cremithick Speculoos', code: 'N330', qty: '100 g' }
    ],
    steps: [
      'Add water 4.5 L',
      'Add 1 bag Rubicone SoftYoghurt Mild',
      'Add 460 g Rubicone Speculoos Varieg',
      'Add 100 g Rubicone Cremithick Speculoos',
      'Mix well with the electric mixer'
    ]
  },
  {
    name: 'Mango Yuzu',
    ingredients: [
      { name: 'Water', qty: '4 L' },
      { name: 'Rubicone SoftYoghurt Mild', code: 'N702', qty: '1 bag' },
      { name: 'Rubicone Mango Alphonso', qty: '320 g' }
    ],
    steps: [
      'Add water 4 L',
      'Add 1 bag Rubicone SoftYoghurt Mild',
      'Add 320 g Rubicone Mango Alphonso',
      'Mix well with the electric mixer'
    ]
  },
  {
    name: 'Golden Gaytime',
    ingredients: [
      { name: 'Water', qty: '4 L' },
      { name: 'Rubicone SoftYoghurt Mild', code: 'N702', qty: '1 bag' },
      { name: 'Rubicone Butterscotch', qty: '400 g' }
    ],
    steps: [
      'Add water 4 L',
      'Add 1 bag Rubicone SoftYoghurt Mild',
      'Add 400 g Rubicone Butterscotch',
      'Mix well with the electric mixer'
    ]
  },
  {
    name: 'Strawberry',
    ingredients: [
      { name: 'Water', qty: '4 L' },
      { name: 'Rubicone Vegan Mix', qty: '1 bag' },
      { name: 'Strawberry Syrup', qty: '300 g' }
    ],
    steps: [
      'Add water 4 L',
      'Add 1 bag Rubicone Vegan Mix',
      'Add 300 g Strawberry Syrup',
      'Mix well with the electric mixer'
    ]
  },
  {
    name: 'Chocolate',
    ingredients: [
      { name: 'Water', qty: '4 L' },
      { name: 'Rubicone SoftYoghurt Mild', code: 'N702', qty: '1 bag' },
      { name: 'Rubicone Coco Powder', code: 'F827', qty: '300 g' }
    ],
    steps: [
      'Dissolve 300 g Rubicone Coco Powder in 1 L of hot water',
      'Add this to the remaining 3 L of cold water',
      'Add 1 bag Rubicone SoftYoghurt Mild',
      'Mix well with the electric mixer'
    ]
  }
];
