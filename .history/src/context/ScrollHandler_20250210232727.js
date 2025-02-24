import React from 'react';

const ScrollHandler = ({ groupedMenu, categoryHeights, setSelectedCategory, categoryListRef, flatListRef }) => {
  // 处理 FlatList 滚动
  const handleScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    let categoryIndex = 0;
    let sectionHeight = 0;

    // 遍历每个类别的高度，计算当前滚动到哪个类别
    for (let i = 0; i < categoryHeights.length; i++) {
      sectionHeight += categoryHeights[i];
      if (contentOffsetY >= sectionHeight - categoryHeights[i] && contentOffsetY < sectionHeight) {
        categoryIndex = i;
        break;
      }
    }

    // 设置当前选择的类别
    if (groupedMenu[categoryIndex]) {
      setSelectedCategory(groupedMenu[categoryIndex].category_name);
    }

    // 滚动类别栏到相应的位置
    categoryListRef.current.scrollTo({
      x: categoryIndex * 120, // 120是每个类别项的宽度，可以根据实际情况调整
      animated: true,
    });
  };

  // 点击类别时，滚动 FlatList 到相应位置
  const handleCategoryClick = (categoryName, index) => {
    setSelectedCategory(categoryName);
    flatListRef.current.scrollToIndex({
      index,
      animated: true,
    });
  };

  return {
    handleScroll,
    handleCategoryClick,
  };
};

export default ScrollHandler;
