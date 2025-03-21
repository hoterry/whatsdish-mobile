const scrollToCategoryIndex = (index, retry = 0) => {
    if (!flatListRef.current || !categoryHeights[index]) {
      if (retry < 10) {
        setTimeout(() => scrollToCategoryIndex(index, retry + 1), 100);
      }
      return;
    }
  
    try {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
      });
    } catch (error) {
      console.warn("[Menu Section Warning] scrollToIndex fallback:", error);
  
      let offset = 0;
      for (let i = 0; i < index; i++) {
        offset += categoryHeights[i] || 0;
      }
  
      flatListRef.current.scrollToOffset({
        offset,
        animated: true,
      });
    }
  };
  