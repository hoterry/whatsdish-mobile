import React from 'react';

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


const ScrollHandler = ({ groupedMenu, categoryHeights, setSelectedCategory, categoryListRef }) => {
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

  return { handleScroll };
};

export default ScrollHandler;