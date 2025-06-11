import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Image, FlatList, StyleSheet, Dimensions } from 'react-native';

export default function ReaderScreen({ route }) {
  const { chapterId } = route.params;
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChapterPages = async () => {
    try {
      const response = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`);
      const data = await response.json();

      const baseUrl = data.baseUrl;
      const hash = data.chapter.hash;
      const images = data.chapter.data;

      const pageUrls = images.map(img => `${baseUrl}/data/${hash}/${img}`);
      setPages(pageUrls);
    } catch (error) {
      console.error('Erro ao buscar páginas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapterPages();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <FlatList
      data={pages}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item }}
          style={styles.pageImage}
          resizeMode="contain"
        />
      )}
    />
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageImage: {
    width: screenWidth,
    height: screenWidth * 1.5,
    marginBottom: 10,
    backgroundColor: '#000',
  },
});
