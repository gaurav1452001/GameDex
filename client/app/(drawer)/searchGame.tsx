import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function SearchGame() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigation = useNavigation()

  const tabs = ['GAMES', 'REVIEWS', 'LISTS', 'DEVELOPERS']

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and search */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#666"
            clearButtonMode='always'
            autoCapitalize='none'
            autoCorrect={false}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
      </View>

      {/* Navigation Tabs */}
      {/* <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View> */}

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#2a2a2a',
  },
  backButton: {
    marginRight: 25,
  },
  searchContainer: {
    flex: 1,
  },
  searchInput: {
    color: '#fff',
    fontSize: 15,
    width: '80%',
    paddingHorizontal: 10,
    backgroundColor: '#333',
  },
  tabContainer: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginLeft: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00d4aa',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 16,
  },
  searchItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchTerm: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
  },
  categoryTag: {
    backgroundColor: '#404040',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '500',
  },
})
