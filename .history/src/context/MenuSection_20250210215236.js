import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useCart } from './CartContext'; 
import { useNavigation } from '@react-navigation/native';

const MenuSection = ({ restaurantId, restaurants }) => {
  const [menu, setMenu] = useState([]);
  const [groupedMenu, setGroupedMenu] = useState([]);
  const [categoryHeights, setCategoryHeights] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);  
  const navigation = useNavigation();
  const flatListRef = useRef();
  const categoryListRef = useRef();
  const { addToCart, getTotalItems } = useCart();

useEffect(() => {
  if (restaurantId === undefined || restaurantId === null) {
    console.error("restaurantId is undefined or null");
  } else {
    console.log("restaurantId inside MenuSection:", restaurantId);
  }
}, [restaurantId]);
  
useEffect(() => {
  const fetchMenu = async () => {
    try {
      const response = await fetch(
        `http://10.0.0.7:5000/menu?restaurant_id=${restaurantId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch menu');
      }

      const data = await response.json();
      console.log("Fetched menu data:", data); 
      console.log(restaurantId)
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
    } catch (err) {
      console.error('Error fetching menu:', err.message);
      setError('Unable to load menu, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  fetchMenu();
}, [restaurantId]);


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

  const handleScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    let categoryIndex = 0;
    let sectionHeight = 0;

    for (let i = 0; i < categoryHeights.length; i++) {
      sectionHeight += categoryHeights[i];
      if (contentOffsetY >= sectionHeight - categoryHeights[i] && contentOffsetY < sectionHeight) {
        categoryIndex = i;
        break;
      }
    }

    setSelectedCategory(groupedMenu[categoryIndex].category_name);
    categoryListRef.current.scrollTo({
      x: categoryIndex * 120,
      animated: true,
    });
  };

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
    console.log(restaurantId); 
    addToCart(restaurantId, item); 
  };
  const handleViewCart = () => {
    navigation.navigate('Cart', { restaurantId, restaurants }); 
  };

  if (loading) {
    return <Text style={styles.loading}>Loading menu...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (!groupedMenu.length) {
    return <Text style={styles.empty}>No menu items available.</Text>;
  }

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
      <Text style={styles.description }numberOfLines={2} ellipsizeMode="tail">{menuItem.description}</Text>
      <Text style={styles.price}>${menuItem.price}</Text>
    </View>

    <TouchableOpacity
      style={styles.addButton}
      onPress={() => handleAddToCart(menuItem)} 
    >
      <Text style={styles.addButtonText}>ADD</Text>
    </TouchableOpacity>
  </View>
      ))}

    </View>
  );

  const handleCategoryClick = (categoryName, index) => {
    setSelectedCategory(categoryName);
    flatListRef.current.scrollToIndex({
      index,
      animated: true,
    });
  };

  const cartItemCount = getTotalItems(restaurantId); // 获取当前餐厅购物车的商品数量
  console.log('Cart Item Count > 0:', cartItemCount > 0);

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

    </View>
  );
};

const styles = StyleSheet.create({
  menuCategory: {
    marginBottom: 20,
  },

  categoryHeader: {
    fontSize: 24,
    fontFamily: 'Urbanist-ExtraBold',   
    marginVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 5
  },
  name: {
    fontSize: 23,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 5
  },
  description: {
    fontSize: 22,
    color: '#555',
    marginBottom: 5,
    lineHeight: 24, // 控制行高
    maxHeight: 48, // 限制最大高度（假设两行文字）
    overflow: 'hidden', // 超出部分隐藏
    textOverflow: 'ellipsis', // 添加省略号
    whiteSpace: 'nowrap', // 单行显示（可选）
  },
  price: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row', // 横向排列
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center', // 垂直居中
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 140, // 固定高度（可根据图片和文字调整）
  },
  info: {
    flex: 1, // 让文本部分占据剩余空间
    marginLeft: -10
  },

  menuTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuName: {
    fontSize: 24,
    fontFamily: 'Quicksand-Bold',
  },

  price: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginRight: 20,
    marginLeft: -10,

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
    fontSize: 26,
    color: '#333',
    lineHeight: 30, // 增加行高，确保文字底部不会被遮挡
    textAlignVertical: 'center', // 垂直居中（如果适用）
  },
  flatList: {
    marginBottom: "180%",
  },
  addButton: {
    backgroundColor: '#000',  // 按钮背景色
    padding: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  viewCartButton: {
    position: 'absolute',
    top: "38%", // 控制按钮位置
    left: 20, // 控制按钮左侧距离
    backgroundColor: '#000', // 按钮背景颜色
    padding: 10,
    borderRadius: 5,
    zIndex: 999, // 确保按钮在前面
    width: "90%",
    height: "4%", // 增加按钮高度
    justifyContent: 'center', // 垂直居中
    alignItems: 'center', // 水平居中
    flexDirection: 'row', // 确保文本水平排列

  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center', // 确保文本居中
  },
  
  
});

export default MenuSection;
