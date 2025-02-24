// components/AdCarousel.js
import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';

const ads = [
  { id: '1', image: 'https://cdn.printnetwork.com/production/assets/themes/5966561450122033bd4456f8/imageLocker/5f206dc35d4bff1ada62fb4c/blog/blog-description/1647973541988_restaurant-banner.png' },
  { id: '2', image: 'https://marketplace.canva.com/EAFh8EnFLW4/1/0/1600w/canva-maroon-and-yellow-modern-food-promotion-banner-landscape-xPGAjV9zPS0.jpg' },
  { id: '3', image: 'https://marketplace.canva.com/EAFh8EnFLW4/1/0/1600w/canva-maroon-and-yellow-modern-food-promotion-banner-landscape-xPGAjV9zPS0.jpg' },
];



const AdCarousel = () => {
  return (
    <View style={styles.carouselContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {ads.map((ad) => (
          <Image key={ad.id} source={{ uri: ad.image }} style={styles.adImage} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width: "100%", height: 100, borderRadius: 8,  marginLeft: 15 
  },
  adImage: {
    width: 200, height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
});

export default AdCarousel;
