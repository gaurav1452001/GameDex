import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '@/redux/hooks';
import { clearList } from '@/redux/listCreationData/listCreationDataSlice';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'
import { useUser } from '@clerk/clerk-expo';
import axios from 'axios';
import { Authenticated,useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from "@/convex/_generated/dataModel";
import { listGames } from '@/types/listTypes';
import { SearchGameType } from '@/types/gameTypes';


const CreateList = () => {
    const { user } = useUser();
    const params = useLocalSearchParams();
    const dispatch = useAppDispatch();
    const updateList = useMutation(api.lists.updateList)
    const [listName, setListName] = useState('');
    const [listDesc, setListDesc] = useState('');
    const [listItems, setListItems] = useState<listGames[]>([]);

    const listId: Id<"lists"> = params.listId as Id<"lists">;
    const listData = useQuery(api.lists.getListById, { id: listId });

    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [gamePages, setGamePages] = useState<SearchGameType[]>([]);

    useEffect(() => {
            if (listData) {
                setListName(listData.listName || '');
                setListDesc(listData.listDesc || '');
                setListItems(listData.list_game_ids || []);
            }
        }, [listData]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const ip_address = process.env.EXPO_PUBLIC_IP_ADDRESS || '';
                const response = await axios.get(`http://${ip_address}:8000/posts/search`, {
                    params: {
                        searchText: searchText
                    }
                });
                setGamePages(response.data);
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };
        fetchGames();
    }, [searchText]);

    return (
        <View style={{ flex: 1, backgroundColor: '#0b0b0bff' }}>
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => {
                    setGamePages([]);
                    setSearchText("");
                    setModalVisible(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', paddingHorizontal: 16, paddingVertical: 5, }}>
                            <TextInput
                                style={{ fontSize: 17, color: '#d4d4d4ff', flex: 3.2, }}
                                placeholder="Search Game..."
                                placeholderTextColor="#7e7e7eff"
                                autoCapitalize='none'
                                autoCorrect={false}
                                value={searchText}
                                onChangeText={setSearchText}
                                returnKeyType='done'
                                maxLength={100}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    setGamePages([]);
                                    setSearchText("");
                                    setModalVisible(false);
                                }}
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', }}
                            >
                                <Ionicons name="close" size={22} color="#9a9a9aff" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#5e5e5eff' }} />
                        <FlatList
                            data={gamePages}
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={true}
                            style={{ flexGrow: 0 }}
                            contentContainerStyle={{ paddingBottom: 10, paddingHorizontal: 10, }}
                            renderItem={({ item: gamePage }) => (
                                <TouchableOpacity onPress={() => {
                                    setModalVisible(false);
                                    if (!listItems.some(item => item.game_id === gamePage.id.toString())) {
                                        setListItems((prevList) => [
                                            ...prevList,
                                            {
                                                game_id: gamePage.id.toString(),
                                                game_name: gamePage.name,
                                                game_cover_url: gamePage.cover?.url || ""
                                            }
                                        ]);
                                    }
                                }} key={gamePage.id}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                                        {gamePage.cover?.url ? (
                                            <Image
                                                source={{ uri: 'https:' + gamePage.cover.url.replace('t_thumb', 't_cover_big_2x') }}
                                                style={styles.displayImage}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View style={styles.displayImage}>
                                                <Text style={{ color: '#f0f0f0', fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>
                                                    {gamePage.name}
                                                </Text>
                                            </View>
                                        )}
                                        <View style={{ flex: 1, flexDirection: 'column', marginLeft: 10 }}>
                                            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '500' }}>
                                                {gamePage?.name}{' '}
                                                <Text style={{ color: '#aaa', fontSize: 11, fontWeight: 'normal' }}>
                                                    {gamePage?.first_release_date
                                                        ? new Date(gamePage.first_release_date * 1000).getFullYear()
                                                        : null
                                                    }
                                                </Text>
                                            </Text>
                                            <Text style={{ color: '#aaa', fontSize: 12, fontWeight: 'bold' }}>
                                                {gamePage?.involved_companies?.[0]?.company?.name}
                                                {gamePage?.involved_companies?.length > 1 && ', '}
                                                {gamePage?.involved_companies?.[1]?.company?.name}
                                            </Text>

                                        </View>
                                    </View>
                                    <View style={{ height: 1, backgroundColor: '#3e3e3eff', marginVertical: 3 }} />
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 20 }}>
                                    No games found.
                                </Text>
                            }
                        />
                    </View>
                </View>
            </Modal>

            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => router.push('/(drawer)/(tabs)')} style={{ marginRight: 25 }}>
                        <Ionicons name="close" size={22} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
                        New List
                    </Text>
                </View>
                <TouchableOpacity onPress={() => {
                    if (listName.trim() && listItems.length > 0) {
                        updateList({
                            listId,
                            externalId: user?.id || '',
                            name: user?.firstName || '',
                            userImageUrl: user?.imageUrl || '',
                            listName,
                            listDesc,
                            list_game_ids: listItems
                        }).then(() => {
                            dispatch(clearList());
                            router.push('/(drawer)/private/lists');
                        }).catch((error) => {
                            console.error('Error creating list:', error);
                        });
                    } else {
                        alert('Please enter a List name or add at least one game to your List.');
                    }
                }}>
                    <Ionicons name="checkmark" size={22} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, backgroundColor: '#181818', paddingBottom: 10, paddingHorizontal: 16, paddingTop: 19 }}>
                <TextInput
                    style={{ fontSize: 17, borderBottomWidth: 1, borderColor: '#ccc', padding: 5, color: '#fff', }}
                    placeholder="List Name"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={listName}
                    onChangeText={setListName}
                    onSubmitEditing={() => {
                        if (listName.trim()) {
                            console.log('Creating list:', listName)
                        }
                    }}
                    returnKeyType='done'
                    maxLength={100}
                    scrollEnabled={true}
                    textAlignVertical="top"
                    spellCheck={false}
                />

                <TextInput
                    style={{ fontSize: 14, padding: 5, color: '#fff', marginBottom: 20, marginTop: 10 }}
                    placeholder="Add description..."
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    multiline={true}
                    value={listDesc}
                    onChangeText={setListDesc}
                    onSubmitEditing={() => {
                        if (listDesc.trim()) {
                            console.log('Creating list:', listDesc)
                        }
                    }}
                    maxLength={1000}
                    scrollEnabled={true}
                    textAlignVertical="top"
                    spellCheck={false}
                />
                <TouchableOpacity
                    style={{
                        backgroundColor: '#2d2d2dff',
                        padding: 15,
                        borderRadius: 8,
                        alignItems: 'center',
                        marginVertical: 20,
                    }}
                    onPress={() => {
                        setModalVisible(true);
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                        Add Entry
                    </Text>
                </TouchableOpacity>
                <FlatList
                    data={listItems}
                    keyExtractor={(item) => item.game_id}
                    showsVerticalScrollIndicator={false}
                    style={{ flexGrow: 0 }}
                    contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 5, }}
                    renderItem={({ item: listGame }) => (
                        <TouchableOpacity onPress={() => { }} key={listGame.game_id}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
                                {listGame.game_cover_url ? (
                                    <Image
                                        source={{ uri: 'https:' + listGame.game_cover_url.replace('t_thumb', 't_cover_big_2x') }}
                                        style={styles.displayImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.displayImage}>
                                        <Text style={{ color: '#f0f0f0', fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>
                                            {listGame.game_name}
                                        </Text>
                                    </View>
                                )}
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10 }}>
                                    <Text style={{ flex: 4, color: '#fff', fontSize: 12, fontWeight: '500' }}>
                                        {listGame.game_name}
                                    </Text>
                                    <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Ionicons
                                            name="close-circle"
                                            size={20}
                                            color="#a8a8a8ff"
                                            onPress={() => {
                                                setListItems((prevList) => prevList.filter(item => item.game_id !== listGame.game_id));
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ height: 1, backgroundColor: '#3e3e3eff', marginVertical: 3, marginRight: -15 }} />
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 20 }}>
                            No Games Added
                        </Text>
                    }
                />
            </View>
        </View>
    )
}

export default CreateList;


const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#181818',
        padding: 16,
    },
    mainView: {
        backgroundColor: '#181818',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    displayImage: {
        width: 57,
        height: 84.873,
        borderColor: '#535353ff',
        backgroundColor: '#404040',
        justifyContent: 'center',
        marginRight: 4,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#2a2a2a',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(3, 3, 3, 0.65)",
    },
    modalView: {
        marginHorizontal: 20,
        backgroundColor: "#363636ff",
        borderRadius: 5,
        height: '80%',
        overflow: "hidden",
    },
    modalText: {
        marginBottom: 25,
        color: "white",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        paddingHorizontal: 20,
    },
    modalTextContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        borderWidth: 1,
        borderColor: "#2c2c2cff",
    },
});