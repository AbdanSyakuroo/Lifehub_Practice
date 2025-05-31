// src/screens/Detail.tsx
import React from 'react';
import { View, Text, Image, ScrollView, Linking } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import tw from 'twrnc';

type DetailRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const detail = () => {
  const { params: { article } } = useRoute<DetailRouteProp>();

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      <Image source={{ uri: article.urlToImage }} style={tw`w-full h-80`} />
      <View style={tw`p-5`}>
        <Text style={tw`text-2xl font-bold text-gray-900 mb-2`}>{article.title}</Text>
        <Text style={tw`text-xs text-gray-500 mb-4`}>
          {article.author || 'Unknown'} • {new Date(article.publishedAt).toLocaleDateString()}
        </Text>
        <Text style={tw`text-base text-gray-800 mb-4`}>
          {article.content || article.description}
        </Text>
        <Text
          style={tw`text-red-600 underline`}
          onPress={() => Linking.openURL(article.url)}
        >
          Baca artikel lengkap di {article.source.name}
        </Text>
      </View>
    </ScrollView>
  );
};

export default detail;
