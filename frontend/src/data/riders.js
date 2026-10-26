export const DEMO_RIDERS = [
  {
    id: 'rider-1',
    name: 'Aryan Mehra',
    email: 'aryan.rider@rideflow.demo',
    phone: '+91 99887 66554',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.96,
    totalRides: 38,
    totalSpent: 8940,
    preferredPayment: 'UPI',
    savedPlaces: [
      {
        id: 'fav-1',
        title: 'Campus Dorm',
        type: 'home',
        address: 'Chitkara University, Franklin Block, Rajpura',
        locationId: 'loc-1',
      },
      {
        id: 'fav-2',
        title: 'Weekend Hangout',
        type: 'favorite',
        address: 'Elante Mall, Phase 1, Chandigarh',
        locationId: 'loc-4',
      },
      {
        id: 'fav-3',
        title: 'Home Station',
        type: 'transit',
        address: 'Chandigarh Railway Station, Daria',
        locationId: 'loc-3',
      },
    ],
  },
];

export const DEFAULT_DEMO_RIDER = DEMO_RIDERS[0];
