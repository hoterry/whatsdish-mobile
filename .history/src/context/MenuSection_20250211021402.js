import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useCart } from './CartContext';
import { useNavigation } from '@react-navigation/native';
import ScrollHandler from './ScrollHandler'; 
import MenuFetcher from './MenuFetcher'; 

const MenuSection = ({ restaurantId, restaurants }) => {
  const [menu, setMenu] = useState([]);
  const [groupedMenu, setGroupedMenu] = useState([]);
  const [categoryHeights, setCategoryHeights] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigation = useNavigation();
  const flatListRef = useRef();
  const categoryListRef = useRef();
  const { addToCart, getTotalItems } = useCart();
  const { handleScroll, handleCategoryClick } = ScrollHandler({
    groupedMenu,
    categoryHeights,
    setSelectedCategory,
    categoryListRef,
    flatListRef,
  });
  const handleDataFetched = (data) => {
    setMenu(data);
    const grouped = data.reduce((acc, item) => {
      const category = acc.find((c) => c.category_name === item.category_name);
      if (category) {
        category.items.push(item);
      } else {
        acc.push({
          category_name: item.category_name,
          items: [item],
        });
      }
      return acc;
    }, []);
    setGroupedMenu(grouped);
  };

  useEffect(() => {
    if (groupedMenu.length > 0) {
      const firstCategory = groupedMenu[0].category_name;
      setSelectedCategory(firstCategory);
      flatListRef.current.scrollToIndex({
        index: 0,
        animated: true,
      });
    }
  }, [groupedMenu]);

  const handleCategoryLayout = (event, index) => {
    const { height } = event.nativeEvent.layout;
    setCategoryHeights((prevHeights) => {
      const newHeights = [...prevHeights];
      newHeights[index] = height;
      return newHeights;
    });
  };

  const handleAddToCart = (item) => {
    console.log("Add to Cart clicked");
    addToCart(restaurantId, item);
  };

  const handleViewCart = () => {
    navigation.navigate('Cart', { restaurantId, restaurants });
  };

  const cartItemCount = getTotalItems(restaurantId); // 获取当前餐厅购物车的商品数量
  console.log('Cart Item Count > 0:', cartItemCount > 0);

  const renderCategory = ({ item: category, index }) => (
    <View
      style={styles.categorySection}
      key={category.category_name}
      onLayout={(event) => handleCategoryLayout(event, index)}
    >
      <Text style={styles.categoryHeader}>{category.category_name}</Text>
      {category.items.map((menuItem) => (
        <View key={menuItem.id} style={styles.menuItem}>
          <Image source={{ uri: menuItem.image_url }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.name}>{menuItem.name}</Text>
            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
              {menuItem.description}
            </Text>
            <Text style={styles.price}>${menuItem.price}</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(menuItem)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={styles.categoryList}
        ref={categoryListRef}
        showsHorizontalScrollIndicator={false}
      >
        {groupedMenu.map((category, index) => (
          <TouchableOpacity
            key={category.category_name}
            style={[styles.categoryItem, selectedCategory === category.category_name && styles.selectedCategory]}
            onPress={() => handleCategoryClick(category.category_name, index)}
          >
            <Text style={styles.categoryText}>{category.category_name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        ref={flatListRef}
        data={groupedMenu}
        keyExtractor={(item) => item.category_name}
        renderItem={renderCategory}
        style={styles.flatList}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {cartItemCount > 0 && (
        <TouchableOpacity style={styles.viewCartButton} onPress={handleViewCart}>
          <Text style={styles.viewCartButtonText}>
            View Cart ({cartItemCount})
          </Text>
        </TouchableOpacity>
      )}
      <MenuFetcher restaurantId={restaurantId} onDataFetched={handleDataFetched} />
    </View>
  );
};
  const styles = StyleSheet.create({

      categoryHeader: {
        fontSize: 20,
        fontFamily: 'Urbanist-ExtraBold',
        fontWeight: 'bold',
        marginVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 5
      },
      name: {
        fontSize: 21,
        fontFamily: 'Quicksand-Bold',
        marginBottom: 5
      },
      description: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
        lineHeight: 20,
        maxHeight: 48, // 限制最大高度，防止过长的描述
        maxWidth: 240,
        overflow: 'hidden', // 超出部分隐藏
        textOverflow: 'ellipsis', // 添加省略号
        whiteSpace: 'nowrap', // 防止换行，保持单行显示
      },
      price: {
        fontSize: 14,
        color: '#000',
        marginBottom: 10,
      },
      menuItem: {
        flexDirection: 'row',  // 保持左右排布
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center', // 确保内容垂直居中
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        height: 140,  // 固定高度，确保图片和文字在同一高度
        position: 'relative',
      },
      info: {
        flex: 1,  // 让文本占用剩余空间
        marginRight: 15,
        justifyContent: 'center',  // 确保文本垂直居中
      },

      image: {
        width: 120,
        height: 120,
        borderRadius: 10,
        position: 'absolute',
        right: 15,

      },
      categoryList: {
        paddingHorizontal: 10,
        marginBottom: 15,
      },
      categoryItem: {
        marginRight: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
      },
      selectedCategory: {
        borderBottomWidth: 2.5,
        borderBottomColor: 'black',
      },
      categoryText: {
        fontSize: 18,
        color: '#333',
        lineHeight: 29,
        textAlignVertical: 'center',
      },
      flatList: {
        marginBottom: "180%",
      },
      addButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // 半透明的黑色背景
        width: 30,  // 按钮宽度
        height: 30, // 按钮高度
        borderRadius: 50,  // 圆形按钮
        position: 'absolute',
        bottom: 10,
        right: 10,
        justifyContent: 'center',  // 垂直居中
        alignItems: 'center',  // 水平居中
      },
      addButtonText: {
        color: '#fff',
        fontSize: 20,  // 增大“+”符号的字体大小
        fontWeight: 'bold', // 加粗
      },
      viewCartButton: {
        position: 'absolute',
        top: "38%",
        left: 20,
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
        zIndex: 999,
        width: "90%",
        height: "4%",
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      },
      viewCartButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
      },
    });
    
  
export default MenuSection;
