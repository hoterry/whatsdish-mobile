import React from 'react';

const ScrollHandler = ({ groupedMenu, categoryHeights, setSelectedCategory, categoryListRef, flatListRef }) => {
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
