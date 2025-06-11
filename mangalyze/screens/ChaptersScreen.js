import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CHAPTERS_LIMIT = 100;

export default function ChaptersScreen({ route, navigation }) {
  const { mangaId } = route.params;

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [language, setLanguage] = useState('en');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchChapters = async (currentOffset, isInitialLoad) => {
    if (!isInitialLoad && !hasMore) {
        return;
    }
    if (loading || loadingMore) {
        return;
    }

    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await fetch(
        `https://api.mangadex.org/chapter?manga=${mangaId}&translatedLanguage[]=${language}&order[chapter]=asc&limit=${CHAPTERS_LIMIT}&offset=${currentOffset}`
      );
      const data = await res.json();

      if (data.result !== 'ok' || !Array.isArray(data.data)) {
          setHasMore(false);
          return;
      }

      const chapterList = data.data.map((ch) => ({
        id: ch.id,
        chapter: ch.attributes.chapter || 'N/A',
        title: ch.attributes.title || '',
      }));

      if (isInitialLoad) {
        setChapters(chapterList);
      } else {
        setChapters((prevChapters) => {
          const existingChapterIds = new Set(prevChapters.map(ch => ch.id));
          const newUniqueChapters = chapterList.filter(ch => !existingChapterIds.has(ch.id));
          return [...prevChapters, ...newUniqueChapters];
        });
      }

      setHasMore(chapterList.length === CHAPTERS_LIMIT);

    } catch (err) {
      console.error('Erro ao buscar capítulos:', err);
      setHasMore(false);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    setChapters([]);
    setOffset(0);
    setHasMore(true);
    fetchChapters(0, true);
  }, [mangaId, language]);

  const openReader = (chapterId) => {
    navigation.navigate('Reader', { chapterId });
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      const nextOffset = offset + CHAPTERS_LIMIT;
      setOffset(nextOffset);
      fetchChapters(nextOffset, false);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator size="small" color="#000" />
        <Text>Carregando mais...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Idioma:</Text>
      <Picker
        selectedValue={language}
        onValueChange={(value) => setLanguage(value)}
        style={styles.picker}
      >
        <Picker.Item label="Português (pt-br)" value="pt-br" />
        <Picker.Item label="Inglês (en)" value="en" />
        <Picker.Item label="Espanhol (es)" value="es" />
        <Picker.Item label="Japonês (ja)" value="ja" />
        <Picker.Item label="Francês (fr)" value="fr" />
      </Picker>

      {loading && chapters.length === 0 ? (
        <ActivityIndicator size="large" />
      ) : chapters.length === 0 && !loading ? (
        <Text style={styles.noChaptersText}>Nenhum capítulo encontrado para este idioma.</Text>
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openReader(item.id)}>
              <View style={styles.chapterItem}>
                <Text style={styles.chapterText}>Capítulo {item.chapter}</Text>
                {item.title ? <Text>{item.title}</Text> : null}
              </View>
            </TouchableOpacity>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  chapterItem: {
    marginVertical: 8,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  chapterText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  loaderFooter: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#ced0ce',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  noChaptersText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});