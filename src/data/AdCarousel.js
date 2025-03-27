import React from 'react';
import { View, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

const wp = (percentage) => {
  return width * (percentage / 150);
};

const hp = (percentage) => {
  return height * (percentage / 150);
};

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
    width: "96%",
    height: isTablet ? hp(20) : hp(15), 
    borderRadius: 8,
    alignSelf: 'center', 
    marginVertical: hp(1.2), 
  },
  adImage: {
    width: isTablet ? wp(70) : wp(80),
    height: isTablet ? hp(20) : hp(15), 
    marginRight: wp(2), 
    borderRadius: 10,
  },
});

export default AdCarousel;