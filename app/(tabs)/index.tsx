import { SafeAreaView, View, Text, FlatList, TextInput, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import tw from 'twrnc';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons'; // Jika pakai Expo
// atau
// import Feather from 'react-native-vector-icons/Feather';


type DailyProps = {
  name: string;
  category: string;
  date: string;
  id: string;
  status: string;
};

const Index = () => {
  const [daily, setDaily] = useState<DailyProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [editId, setEditId] = useState('');
  const [status, setStatus] = useState('pending');
  const [filterCategory, setFilterCategory] = useState('');

  const toggleStatus = async (item: DailyProps) => {
    const newStatus = item.status === 'complete' ? 'pending' : 'complete';
    try {
      await axios.put(`http://10.0.2.2:8000/api/daily/${item.id}`, {
        name: item.name,
        category: item.category,
        date: item.date,
        status: newStatus,
      });
      await getDaily();
    } catch (error) {
      console.error(error);
    }
  };

  const getDaily = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/api/daily');
      setDaily(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addDaily = async () => {
    if (!name || name.length < 3 || !category || !date) {
      alert('Nama amalan minimal 3 karakter dan semua form harus diisi');
      return;
    }
    try {
      await axios.post('http://10.0.2.2:8000/api/daily', {
        name,
        category,
        date,
        status: 'pending',
      });
      resetForm();
      await getDaily();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const editDaily = async () => {
    if (!editId || !name || name.length < 3 || !category || !date) {
      Alert.alert('Peringatan', 'Nama amalan minimal 3 karakter dan semua form harus diisi');
      return;
    }
    try {
      await axios.put(`http://10.0.2.2:8000/api/daily/${editId}`, {
        name,
        category,
        date,
      });
      resetForm();
      await getDaily();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const deleteDaily = async (id: string) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus amalan ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`http://10.0.2.2:8000/api/daily/${id}`);
              Alert.alert('Berhasil', 'Data berhasil dihapus');
              await getDaily();
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]
    );
  };


  const handleEditPress = (item: DailyProps) => {
    setEditId(item.id);
    setName(item.name);
    setCategory(item.category);
    setDate(item.date);
  };

  const resetForm = () => {
    setEditId('');
    setName('');
    setCategory('');
    setDate('');
  };

  useEffect(() => {
    getDaily();
  }, []);

  const filteredDaily = filterCategory
    ? daily.filter((item) => item.category === filterCategory)
    : daily;

  const formatDateInput = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    const day = numbers.slice(0, 2);
    const month = numbers.slice(2, 4);
    const year = numbers.slice(4, 8);

    let formatted = day;
    if (month) formatted += `-${month}`;
    if (year) formatted += `-${year}`;

    return formatted;
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-green-50`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <Text style={tw`text-3xl font-bold text-center text-green-900 mt-10 mb-2`}>🕌 Daily Muslim</Text>
        <Text style={tw`text-center text-green-700 italic mb-6`}>
          “Sebaik-baik amal adalah yang rutin meski sedikit.”
        </Text>

        <View style={tw`bg-white rounded-2xl p-4 shadow-lg mb-6`}>
          <Text style={tw`text-green-800 mb-1`}>Nama Amalan</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-md px-3 py-2 mb-4 bg-gray-50`}
            value={name}
            onChangeText={setName}
            placeholder="Contoh: Murajaah Juz 1"
          />

          <Text style={tw`text-green-800 mb-1`}>Kategori</Text>
          <View style={tw`border border-gray-300 rounded-md mb-4 bg-gray-50`}>
            <Picker selectedValue={category} onValueChange={setCategory}>
              <Picker.Item label="Pilih kategori" value="" />
              <Picker.Item label="Pribadi" value="Pribadi" />
              <Picker.Item label="Hafalan" value="Hafalan" />
              <Picker.Item label="Belajar" value="Belajar" />
            </Picker>
          </View>

          <Text style={tw`text-green-800 mb-1`}>Tanggal</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-md px-3 py-2 mb-4 bg-gray-50`}
            value={date}
            onChangeText={(text) => setDate(formatDateInput(text))}
            placeholder="dd-mm-yyyy"
            keyboardType="numeric"
          />

          {editId ? (
            <>
              <TouchableOpacity
                style={tw`bg-yellow-500 rounded-md p-3 mb-2`}
                onPress={() => {
                  Alert.alert(
                    'Konfirmasi Edit',
                    'Apakah Anda yakin ingin menyimpan perubahan?',
                    [
                      { text: 'Batal', style: 'cancel' },
                      {
                        text: 'Simpan',
                        onPress: editDaily,
                      },
                    ]
                  );
                }}
              >
                <Text style={tw`text-white font-semibold text-center`}>Simpan Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tw`bg-gray-400 rounded-md p-3 mb-2`} onPress={resetForm}>
                <Text style={tw`text-white font-semibold text-center`}>Batal Edit</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[
                tw`rounded-md p-3 mb-2`,
                name.length < 3 || !category || !date
                  ? tw`bg-green-300`
                  : tw`bg-green-700`,
              ]}
              onPress={() => {
                if (name.length >= 3 && category && date) {
                  Alert.alert(
                    'Konfirmasi Tambah',
                    'Apakah Anda yakin ingin menambahkan amalan ini?',
                    [
                      { text: 'Batal', style: 'cancel' },
                      {
                        text: 'Tambah',
                        onPress: addDaily,
                      },
                    ]
                  );
                } else {
                  alert('Nama amalan minimal 3 karakter dan semua form harus diisi');
                }
              }}
              disabled={name.length < 3 || !category || !date}
            >
              <Text style={tw`text-white font-semibold text-center`}>Tambah Amalan</Text>
            </TouchableOpacity>


          )}
        </View>

        <View style={tw`bg-white rounded-xl p-3 mb-4 shadow`}>
          <Text style={tw`text-green-800 mb-1`}>Filter Kategori</Text>
          <View style={tw`border border-gray-300 rounded-md bg-gray-50`}>
            <Picker selectedValue={filterCategory} onValueChange={setFilterCategory}>
              <Picker.Item label="Semua Kategori" value="" />
              <Picker.Item label="Pribadi" value="Pribadi" />
              <Picker.Item label="Hafalan" value="Hafalan" />
              <Picker.Item label="Belajar" value="Belajar" />
            </Picker>
          </View>
        </View>

        <Text style={tw`text-lg font-bold text-green-800 mb-4`}>📋 Daftar Amalan</Text>

        {loading ? (
          <Text style={tw`text-gray-500 text-center`}>Memuat data...</Text>
        ) : (
          <FlatList
            data={filteredDaily}
            keyExtractor={(item) => item.id}
            contentContainerStyle={tw`pb-20`}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={tw`mb-3 bg-white rounded-xl p-4 shadow`}>
                <Text
                  style={[
                    tw`text-green-900 font-semibold text-lg mb-1`,
                    item.status === 'complete' && { textDecorationLine: 'line-through', color: '#6b7280' },
                  ]}
                >
                  {item.name}
                </Text>

                <Text style={tw`text-gray-700 mb-1`}>Kategori: {item.category}</Text>
                <Text style={tw`text-gray-700 mb-1`}>Tanggal: {item.date}</Text>

                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Ubah Status',
                      `Tandai amalan ini sebagai "${item.status === 'complete' ? 'belum selesai' : 'selesai'}"?`,
                      [
                        { text: 'Batal', style: 'cancel' },
                        { text: 'Ya', onPress: () => toggleStatus(item) },
                      ]
                    );
                  }}
                  style={tw`flex-row items-center mb-2`}
                >
                  <Feather
                    name={item.status === 'complete' ? 'check-circle' : 'circle'}
                    size={24}
                    color={item.status === 'complete' ? 'green' : 'gray'}
                  />
                  <Text style={tw`ml-2 text-gray-700`}>
                    Status: {item.status === 'complete' ? 'Selesai' : 'Belum'}
                  </Text>
                </TouchableOpacity>


                <View style={tw`flex-row`}>
                  <TouchableOpacity
                    style={tw`bg-blue-500 px-4 py-2 rounded mr-2`}
                    onPress={() => handleEditPress(item)}
                  >
                    <Text style={tw`text-white`}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={tw`bg-red-500 px-4 py-2 rounded`}
                    onPress={() => deleteDaily(item.id)}
                  >
                    <Text style={tw`text-white`}>Hapus</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
