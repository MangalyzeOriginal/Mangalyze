import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function GenreScreen({ route, navigation }) {
  const { genre, name } = route.params;
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const res = await fetch(
          `https://api.mangadex.org/manga?includedTags[]=${genre}&limit=15&includes[]=cover_art`
        );
        const data = await res.json();

        const list = Array.isArray(data.data)
  ? data.data.map((item) => {
      const coverFile = item.relationships.find(
        (rel) => rel.type === 'cover_art'
      )?.attributes?.fileName;

      return {
        id: item.id,
        title: item.attributes.title.en || 'Sem título',
        image: coverFile
          ? `https://uploads.mangadex.org/covers/${item.id}/${coverFile}.256.jpg`
          : null,
      };
    })
  : [];

        setMangas(list);
      } catch (err) {
        console.error('Erro ao buscar por gênero:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenre();
  }, [genre]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gênero: {name}</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={mangas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Chapters', { mangaId: item.id })}
              style={styles.item}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.image}
              />
              <Text style={styles.text}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  item: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  image: { width: 60, height: 90, marginRight: 10, borderRadius: 6 },
  text: { flexShrink: 1 },
});
