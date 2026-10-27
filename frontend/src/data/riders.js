/**
 * Hardcoded Customer Profile for RushRide
 * Dedicated customer-only data with fixed ID and verified account details.
 */
export const HARDCODED_CUSTOMER = {
  id: 'CUST-8820',
  name: 'Aryan Mehra',
  email: 'aryan.customer@rushride.com',
  phone: '+91 99887 66554',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  rating: 4.96,
  role: 'customer',
  accountType: 'RushPrime Gold Customer',
  memberSince: 'March 2024',
  totalRides: 38,
  totalSpent: 8940,
  preferredPayment: 'UPI',
  walletBalance: 1250,
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
    {
      id: 'fav-4',
      title: 'Sector 17 Plaza',
      type: 'favorite',
      address: 'Sector 17-C, Chandigarh Core',
      locationId: 'loc-5',
    },
  ],
};

export const DEMO_RIDERS = [HARDCODED_CUSTOMER];
export const DEFAULT_DEMO_RIDER = HARDCODED_CUSTOMER;
