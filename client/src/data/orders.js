export const orders = [
  {
    id: "ORD-2024-8821",
    date: "2024-12-15",
    status: "delivered",
    total: 338.99,
    trackingNumber: "1Z999AA10123456784",
    estimatedDelivery: "2024-12-20",
    shippingAddress: {
      name: "Alex Johnson",
      line1: "123 Maple Street",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      country: "United States",
    },
    items: [
      {
        id: "p1",
        name: "AirPods Pro Max Wireless",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&auto=format",
        price: 249.99,
        quantity: 1,
        variant: "Silver",
      },
      {
        id: "p10",
        name: "Stainless Steel Water Bottle",
        image:
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&h=100&fit=crop&auto=format",
        price: 38.0,
        quantity: 1,
        variant: "Ocean Blue",
      },
    ],
  },
  {
    id: "ORD-2024-7703",
    date: "2024-11-28",
    status: "delivered",
    total: 189.0,
    trackingNumber: "1Z999AA10123456785",
    shippingAddress: {
      name: "Alex Johnson",
      line1: "123 Maple Street",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      country: "United States",
    },
    items: [
      {
        id: "p2",
        name: "Minimalist Leather Watch",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&auto=format",
        price: 189.0,
        quantity: 1,
        variant: "Tan",
      },
    ],
  },
  {
    id: "ORD-2024-6611",
    date: "2024-11-10",
    status: "shipped",
    total: 567.0,
    trackingNumber: "1Z999AA10123456786",
    estimatedDelivery: "2024-11-18",
    shippingAddress: {
      name: "Alex Johnson",
      line1: "123 Maple Street",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      country: "United States",
    },
    items: [
      {
        id: "p3",
        name: "4K Ultra HD Smart Monitor",
        image:
          "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&h=100&fit=crop&auto=format",
        price: 599.0,
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-2024-5502",
    date: "2024-10-22",
    status: "processing",
    total: 318.0,
    shippingAddress: {
      name: "Alex Johnson",
      line1: "123 Maple Street",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      country: "United States",
    },
    items: [
      {
        id: "p4",
        name: "Merino Wool Turtleneck",
        image:
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&h=100&fit=crop&auto=format",
        price: 89.0,
        quantity: 2,
        variant: "Navy / M",
      },
      {
        id: "p10",
        name: "Stainless Steel Water Bottle",
        image:
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&h=100&fit=crop&auto=format",
        price: 38.0,
        quantity: 2,
        variant: "Black",
      },
      {
        id: "p7",
        name: "Vitamin C Glow Serum",
        image:
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop&auto=format",
        price: 58.0,
        quantity: 1,
      },
    ],
  },
];
