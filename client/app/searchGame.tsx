import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function SearchGame() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('GAMES')
  
  const tabs = ['GAMES', 'REVIEWS', 'LISTS', 'DEVELOPERS']
  const recentSearches = [
    { term: 'superman', category: 'Games' },
    { term: 'zelda', category: 'Games' },
    { term: 'minecraft', category: 'Games' }
  ]

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and search */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
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
      </View>

      {/* Recent Searches */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>RECENT SEARCHES</Text>
        
        {recentSearches.map((search, index) => (
          <TouchableOpacity key={index} style={styles.searchItem}>
            <View style={styles.searchItemContent}>
              <Text style={styles.searchTerm}>{search.term}</Text>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{search.category}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
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
    paddingVertical: 12,
    backgroundColor: '#2a2a2a',
  },
  backButton: {
    marginRight: 16,
  },
  searchContainer: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 18,
    fontWeight: '400',
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
