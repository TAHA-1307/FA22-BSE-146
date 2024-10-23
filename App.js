import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import useFetchQuranData from './useFetchQuranData'; // Custom hook to fetch Quran data

const QuranAppStructure = () => {
  // Fetch Surah data from the provided API
  const { data: surahs, loading: surahsLoading, error: surahsError } = useFetchQuranData('https://api.alquran.cloud/v1/surah', 'surahs');

  // State to manage which Surah is selected (expanded or collapsed)
  const [expandedSurah, setExpandedSurah] = useState(null);

  // Function to toggle Surah dropdown
  const toggleSurah = (surahId) => {
    if (expandedSurah === surahId) {
      setExpandedSurah(null); // Collapse if already expanded
    } else {
      setExpandedSurah(surahId); // Expand the selected Surah
    }
  };

  // Fetch Ayahs of the selected Surah using the API URL format
  const { data: ayahs, loading: ayahsLoading, error: ayahsError } = useFetchQuranData(
    expandedSurah ? `https://api.alquran.cloud/v1/surah/${expandedSurah}` : null,
    `ayahs_${expandedSurah}`
  );

  // Show loading spinner while fetching Surah data
  if (surahsLoading) {
    return <ActivityIndicator size="large" color="#8e44ad" style={styles.loader} />;
  }

  // Show error if Surah data couldn't be fetched
  if (surahsError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{surahsError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.lastReadText}>Last Read</Text>
        <Text style={styles.surahTitle}>Al-Fatiah</Text>
        <Text style={styles.ayahNumber}>Ayah No: 1</Text>
      </View>

      {/* Tabs Section */}
      <View style={styles.tabs}>
        <Text style={styles.tabText}>Surah</Text>
        <Text style={styles.tabText}>Para</Text>
        <Text style={styles.tabText}>Page</Text>
        <Text style={styles.tabText}>Hijb</Text>
      </View>

      {/* Surah List with dropdown functionality */}
      <FlatList
        data={surahs.slice(0, 4)} // Show only the first four Surahs
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => (
          <View>
            {/* Surah Item */}
            <TouchableOpacity onPress={() => toggleSurah(item.number)}>
              <View style={styles.listItem}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{item.number}</Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.surahName}>{item.englishName}</Text>
                  <Text style={styles.surahDetails}>
                    {item.revelationType} - {item.numberOfAyahs} VERSES
                  </Text>
                </View>
                <Text style={styles.arabicText}>{item.name}</Text>
              </View>
            </TouchableOpacity>

            {/* If Surah is expanded, show Ayahs */}
            {expandedSurah === item.number && (
              <View style={styles.ayahContainer}>
                {ayahsLoading ? (
                  <ActivityIndicator size="small" color="#8e44ad" />
                ) : ayahsError ? (
                  <Text style={styles.errorText}>{ayahsError}</Text>
                ) : (
                  <FlatList
                    data={ayahs?.ayahs || []}
                    keyExtractor={(ayah) => ayah.number.toString()}
                    renderItem={({ item: ayah }) => (
                      <View style={styles.ayahItem}>
                        <Text style={styles.ayahText}>{ayah.text}</Text>
                      </View>
                    )}
                  />
                )}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default QuranAppStructure;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3e8ff',
  },
  header: {
    backgroundColor: '#d0b3ff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  lastReadText: {
    color: '#8e44ad',
    fontSize: 16,
    fontWeight: '600',
  },
  surahTitle: {
    fontSize: 28,
    color: '#2c3e50',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  ayahNumber: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#dcdde1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  tabText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: '#ecf0f1',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  iconContainer: {
    backgroundColor: '#d0b3ff',
    borderRadius: 50,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  surahName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  surahDetails: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  arabicText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8e44ad',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  ayahContainer: {
    paddingLeft: 20,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  ayahItem: {
    paddingVertical: 5,
  },
  ayahText: {
    fontSize: 16,
    color: '#2c3e50',
  },
});
