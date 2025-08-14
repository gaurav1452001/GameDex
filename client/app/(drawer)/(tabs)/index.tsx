import { View, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, Text, Modal } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { router } from 'expo-router';
import { HomePageGameType } from '@/types/gameTypes';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [gamePages, setGamePages] = useState<HomePageGameType[]>([]);
  const [Offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState(2);
  const [modalVisible, setModalVisible] = useState(false);

  const renderLoader = () => {
    return (
      <View style={{ backgroundColor: '#181818', justifyContent: 'center', alignItems: 'center', height: 100 }}>
        <ActivityIndicator size="large" color="#4692d0ff" />
        <Text style={{ color: '#61d76fff', fontSize: 13, marginTop: 10 }}>
          Loading more games...
        </Text>
      </View>
    )
  }

  const renderEndMessage = () => {
    if (hasMoreData || gamePages.length === 0) return null;
    return (
      <View style={{ backgroundColor: '#181818', justifyContent: 'center', alignItems: 'center', height: 60 }}>
        <Text style={{ color: '#61d76fff', fontSize: 16 }}>You reached the end!</Text>
      </View>
    );
  };

  const loadMoreGames = () => {
    if (!isLoading && hasMoreData) {
      setOffset(Offset + 52);
    }
  }

  const fetchGames = async () => {
    if (isLoading) return; // Prevent multiple calls
    setIsLoading(true);
    try {
        const ip_Address = process.env.EXPO_PUBLIC_IP_ADDRESS || '';
        const response = await axios.get(`http://${ip_Address}:8000/posts/popular`, {
          params: {
            currentOffset: Offset,
            sortOrder: sortOrder,
          },
        });

        const newGames = response.data;
        
        // Check if we reached the end
        if (!newGames || newGames.length === 0 || newGames.length < 52) {
          setHasMoreData(false);
        }

        setGamePages((gamePages) => [...gamePages, ...newGames]);
    } catch (error) {
        console.error('Error fetching arts:', error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [Offset, sortOrder]);

  const resetAndSetSort = (newSortOrder: number) => {
    setGamePages([]);
    setOffset(0);
    setHasMoreData(true);
    setSortOrder(newSortOrder);
    setModalVisible(false);
  };

  const getSortOrderLabel = () => {
    switch (sortOrder) {
      case 2: return 'Top Wishlists';
      case 3: return 'Top Playing';
      case 4: return 'Top Played';
      case 5: return 'Top 24hr Peak Players';
      default: return 'Sort';
    }
  };

  return (
    <View style={styles.view}>
      <FlatList
        data={gamePages}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
        contentContainerStyle={styles.mainView}
        renderItem={({ item: gamePage }) => (
          <TouchableOpacity onPress={() => router.push(`/(drawer)/games/${gamePage.id}`)} key={gamePage.id}>
            <Image
              source={{ uri: 'https:' + gamePage?.cover?.url?.replace('t_thumb', 't_cover_big_2x') }}
              style={styles.displayImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <>
            {renderLoader()}
            {renderEndMessage()}
          </>
        )}
        onEndReached={loadMoreGames}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Button - Bottom Right */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="filter" size={20} color="#fff" />
        <Text style={styles.filterButtonText}>{getSortOrderLabel()}</Text>
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Games</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterOptions}>
              <TouchableOpacity
                onPress={() => resetAndSetSort(2)}
                style={[
                  styles.filterOption,
                  sortOrder === 2 && styles.activeFilterOption
                ]}
              >
                <Ionicons 
                  name="bookmark-outline" 
                  size={20} 
                  color={sortOrder === 2 ? '#61d76f' : '#fff'} 
                />
                <Text style={[
                  styles.filterOptionText,
                  sortOrder === 2 && styles.activeFilterOptionText
                ]}>
                  Top Wishlists
                </Text>
                {sortOrder === 2 && (
                  <Ionicons name="checkmark" size={20} color="#61d76f" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => resetAndSetSort(3)}
                style={[
                  styles.filterOption,
                  sortOrder === 3 && styles.activeFilterOption
                ]}
              >
                <Ionicons 
                  name="game-controller-outline" 
                  size={20} 
                  color={sortOrder === 3 ? '#61d76f' : '#fff'} 
                />
                <Text style={[
                  styles.filterOptionText,
                  sortOrder === 3 && styles.activeFilterOptionText
                ]}>
                  Top Playing
                </Text>
                {sortOrder === 3 && (
                  <Ionicons name="checkmark" size={20} color="#61d76f" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => resetAndSetSort(4)}
                style={[
                  styles.filterOption,
                  sortOrder === 4 && styles.activeFilterOption
                ]}
              >
                <Ionicons 
                  name="checkmark-circle-outline" 
                  size={20} 
                  color={sortOrder === 4 ? '#61d76f' : '#fff'} 
                />
                <Text style={[
                  styles.filterOptionText,
                  sortOrder === 4 && styles.activeFilterOptionText
                ]}>
                  Top Played
                </Text>
                {sortOrder === 4 && (
                  <Ionicons name="checkmark" size={20} color="#61d76f" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => resetAndSetSort(5)}
                style={[
                  styles.filterOption,
                  sortOrder === 5 && styles.activeFilterOption
                ]}
              >
                <Ionicons 
                  name="trending-up-outline" 
                  size={20} 
                  color={sortOrder === 5 ? '#61d76f' : '#fff'} 
                />
                <Text style={[
                  styles.filterOptionText,
                  sortOrder === 5 && styles.activeFilterOptionText
                ]}>
                  24hr Peak Players
                </Text>
                {sortOrder === 5 && (
                  <Ionicons name="checkmark" size={20} color="#61d76f" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#181818',
  },
  button: {
    width: 100,
    height: 20,
    backgroundColor: "coral",
    borderRadius: 8,
    textAlign: "center"
  },
  mainView: {
    backgroundColor: '#232323',
    justifyContent: 'center',
  },
  displayImage: {
    width: 85,
    height: 126.6,
    margin: 2.4,
    borderWidth: 0.4,
    borderColor: 'gray',
    backgroundColor: '#404040',
  },
  filterButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#1d1d1dff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  filterOptions: {
    padding: 20,
    gap: 4,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#333',
    marginBottom: 8,
    gap: 12,
  },
  activeFilterOption: {
    backgroundColor: '#2e3d27',
    borderWidth: 1,
    borderColor: '#61d76f',
  },
  filterOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  activeFilterOptionText: {
    color: '#61d76f',
    fontWeight: '600',
  },
});