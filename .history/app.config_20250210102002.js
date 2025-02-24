import 'dotenv/config';

export default {
  expo: {
    name: 'FoodOrderingApp',
    slug: 'food-ordering-app',
    extra: {
      apiUrl: process.env.NODE_ENV === 'production' 
        ? process.env.PROD_API_URL 
        : process.env.DEV_API_URL,
    },
  },
};
