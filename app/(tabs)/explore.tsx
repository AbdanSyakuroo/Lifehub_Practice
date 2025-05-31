import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Linking,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import tw from 'twrnc';

type NewsArticle = {
  source: { name: string };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
};

const NewsApp = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const getNews = async () => {
    try {
      const response = await axios.get(
        'https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=4f6a3598b13e40c59810091e00d1ac36'
      );
      setArticles(response.data.articles);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  // Komponen kartu berita dengan desain profesional
  const NewsCard = ({ article }: { article: NewsArticle }) => {
    return (
    <TouchableOpacity style={tw`mb-6 bg-white rounded-xl shadow-lg overflow-hidden`}>
  <Image source={{ uri: article.urlToImage }} style={tw`w-full h-60`} />
  <View style={tw`absolute top-0 left-0 bg-black bg-opacity-50 px-3 py-1 rounded-br-xl`}>
    <Text style={tw`text-white text-xs`}>{article.source.name}</Text>
  </View>

  <View style={tw`p-4`}>
    <Text style={tw`text-xl font-bold text-gray-900 mb-1`} numberOfLines={2}>{article.title}</Text>
    <Text style={tw`text-sm text-gray-600 mb-3`} numberOfLines={3}>{article.description}</Text>
    
    <View style={tw`flex-row justify-between items-center`}>
      <Text style={tw`text-xs italic text-gray-500`}>By {article.author || 'Unknown'}</Text>
      <TouchableOpacity
        onPress={() => Linking.openURL(article.url)}
        style={tw`bg-red-500 px-4 py-1 rounded-full`}
      >
        <Text style={tw`text-white text-sm`}>Read More</Text>
      </TouchableOpacity>
    </View>
  </View>
</TouchableOpacity>

    );
  };

  // Header aplikasi
  const Header = () => (
    <View style={tw`bg-white shadow-sm px-5 pt-10 pb-6`}>
      <Text style={tw`text-3xl font-extrabold text-gray-900`}>KaiserNews</Text>
      <Text style={tw`text-base text-gray-500`}>Trusted Global Source</Text>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <StatusBar barStyle="dark-content" />
      <Header />
      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#EF4444" />
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <NewsCard article={item} />}
          contentContainerStyle={tw`px-5 py-6`}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default NewsApp;
