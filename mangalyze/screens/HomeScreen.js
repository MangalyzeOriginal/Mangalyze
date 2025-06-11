import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPopular();
  }, []);

  const fetchPopular = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'https://api.mangadex.org/manga?limit=10&order[rating]=desc&includes[]=cover_art'
      );
      const data = await res.json();

      const mangas = data.data.map((item) => {
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
      });

      setRecommendations(mangas);
    } catch (err) {
      console.error('Erro ao buscar recomendados:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchManga = async (query) => {
    setSearch(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.mangadex.org/manga?title=${query}&limit=15&includes[]=cover_art`
      );
      const data = await res.json();

      const mangas = data.data.map((item) => {
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
      });

      setSearchResults(mangas);
    } catch (err) {
      console.error('Erro ao buscar mangás:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Chapters', { mangaId: item.id })}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text>Sem capa</Text>
        </View>
      )}
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (

    //PESQUISA

    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Buscar mangá..."
        value={search}
        onChangeText={searchManga}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : search.trim() !== '' ? (
        <>
          <Text style={styles.sectionTitle}>Resultados</Text>
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal={true}
            scrollEnabled={true}
          />
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Recomendados</Text>
          <FlatList
            horizontal
            data={recommendations}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          />


          <Text style={styles.sectionTitle}>Categorias</Text>
          <FlatList
            horizontal
            data={[
              { name: 'Ação', id: '391b0423-d847-456f-aff0-8b0cfc03066b' },
              { name: 'Comédia', id: '4d32cc48-9f00-4cca-9b5a-a839f0764984' },
              { name: 'Fantasia', id: 'cdc58593-87dd-415e-bbc0-2ec27bf404cc' },
              { name: 'Romance', id: '423e2eae-a7a2-4a8b-ac03-a8351462d71d' },
              { name: 'Terror', id: 'cdad7e68-1419-41dd-bdce-27753074a640' },
            ]}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.genreCard}
                onPress={() =>
                  navigation.navigate('Genre', {
                    genre: item.id,
                    name: item.name,
                  })
                }
              >
                <Text style={styles.genreText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  card: {
    width: 120,
    marginRight: 12,
    marginBottom: 16,
  },
  image: {
    width: 120,
    height: 180,
    borderRadius: 6,
    marginBottom: 6,
  },
  placeholder: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
  },
  genreCard: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  genreText: {
    fontWeight: '600',
  },
});
