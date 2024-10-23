// useFetchQuranData.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFetchQuranData = (apiUrl, storageKey) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if data is already in AsyncStorage
        const storedData = await AsyncStorage.getItem(storageKey);
        if (storedData) {
          setData(JSON.parse(storedData)); // Load data from AsyncStorage
        }

        if (apiUrl) {
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error('Network response was not ok');
          const result = await response.json();
          setData(result.data);

          // Store the fetched data in AsyncStorage for offline use
          await AsyncStorage.setItem(storageKey, JSON.stringify(result.data));
        }

        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, storageKey]);

  return { data, loading, error }; // Return data, loading, and error states
};

export default useFetchQuranData;
