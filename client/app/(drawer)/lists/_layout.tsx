import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import ListScreen from './[id]';
import ListComments from './list_comments';
import { router, useLocalSearchParams } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Authenticated, useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { GamePageDataType } from '@/types/gameTypes';

const Tab = createMaterialTopTabNavigator();

export default function ListTabs() {
    const { user } = useUser();
    const { id } = useLocalSearchParams();
    const listId: Id<"lists"> = id as Id<"lists">;
    const list = useQuery(api.lists.getListById, { id: listId });
    const deleteList = useMutation(api.lists.deleteList);
    const [listModalVisible, setListModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const checkUser = () => {
        if (user?.id === list?.externalId) {
            return true;
        }
        return false;
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0b0b0bff' }}>
            <View>
                <Authenticated>
                    {/* delete modal */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={deleteModalVisible}
                        onRequestClose={() => {
                            setDeleteModalVisible(!deleteModalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 }}>
                                    Delete List
                                </Text>
                                <Text style={styles.modalText}>
                                    Are you sure you want to delete this list?
                                </Text>
                                <View style={styles.modalTextContainer}>
                                    <TouchableOpacity
                                        style={styles.buttonClose}
                                        onPress={() => setDeleteModalVisible(!deleteModalVisible)}
                                    >
                                        <Text style={styles.textStyle}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.buttonSignOut}
                                        onPress={() => {
                                            deleteList({ listId, externalId: user?.id as string });
                                            setDeleteModalVisible(!deleteModalVisible);
                                            router.push('/(drawer)/private/lists');
                                        }}
                                    >
                                        <Text style={styles.textStyle}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* option to delete and edit the review */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={listModalVisible}
                        onRequestClose={() => {
                            setListModalVisible(false);
                        }}
                    >
                        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                                <View style={{ backgroundColor: '#222', paddingHorizontal: 24, paddingVertical: 13, width: '100%' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0 }}>
                                        <Text style={{ flex: 6, color: '#fff', fontSize: 16, letterSpacing: 0.5, marginBottom: 10 }}>
                                            {list?.listName}
                                        </Text>
                                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => setListModalVisible(false)} >
                                                <Ionicons name="close" size={24} color="#aaa" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {list?._creationTime && (
                                        <Text style={{ color: '#aaa', letterSpacing: 0.5, fontSize: 14, marginBottom: 15, borderBottomColor: '#404040' }}>
                                            Created on {new Date(list?._creationTime).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </Text>
                                    )}
                                    <View style={{ height: 1, backgroundColor: '#404040', marginBottom: 12, marginHorizontal: -24 }} />
                                    <TouchableOpacity
                                        style={{
                                            paddingVertical: 12,
                                            marginBottom: 12,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 20,
                                        }}
                                        onPress={() => {
                                            setListModalVisible(false);
                                            setDeleteModalVisible(true);
                                        }}
                                    >
                                        <Ionicons name="trash" size={20} color="#e17b50ff" />
                                        <Text style={{ fontSize: 16, color: '#e17b50ff' }}>Delete List</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            paddingVertical: 12,
                                            marginBottom: 12,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 20,
                                        }}
                                        onPress={() => {
                                            setListModalVisible(false);
                                            router.push({
                                                pathname: `/(drawer)/private/listEdit`,
                                                params: {
                                                    listId: list?._id,
                                                }
                                            });
                                        }}
                                    >
                                        <Ionicons name="create" size={20} color="#aaa" />
                                        <Text style={{ fontSize: 16, color: '#aaa' }}>Edit List</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </Authenticated>
                {checkUser() ? (
                    <View style={styles.header}>
                        <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
                            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
                                List
                            </Text>
                        </View>
                        <Authenticated>
                            <TouchableOpacity style={{ paddingHorizontal: 8, borderColor: '#aaa' }} onPress={() => {
                                setListModalVisible(true);
                            }}>
                                <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
                            </TouchableOpacity>
                        </Authenticated>
                    </View>) : (
                    <View style={styles.header}>
                        <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
                            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
                                List
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            <Tab.Navigator
                screenOptions={{
                    tabBarItemStyle: { flex: 1 },
                    tabBarStyle: { backgroundColor: '#0b0b0bff' },
                    tabBarLabelStyle: { color: '#fff', fontSize: 13, letterSpacing: 0.5 },
                    tabBarActiveTintColor: '#ffffffff',
                    tabBarIndicatorStyle: { backgroundColor: '#4692d0ff' },
                }}
            >
                <Tab.Screen name="GAMES" component={ListScreen} options={{ title: "GAMES" }} />
                <Tab.Screen name="COMMENTS" component={ListComments} options={{ title: "COMMENTS" }} />
            </Tab.Navigator>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#181818',
        justifyContent: 'center'
    },
    view: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: '#181818',
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        alignSelf: 'flex-start',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(3, 3, 3, 0.65)",
    },
    modalView: {
        marginHorizontal: 20,
        paddingTop: 20,
        backgroundColor: "#343434ff",
        borderRadius: 8,
        overflow: "hidden",
    },
    buttonClose: {
        backgroundColor: "#343434ff",
        color: "#fff",
        width: "50%",
        fontSize: 25,
        fontWeight: "bold",
        padding: 10,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 15,
    },
    modalText: {
        marginBottom: 20,
        color: "#bebebeff",
        textAlign: "center",
        fontSize: 16,
        letterSpacing: 0.5,
        paddingHorizontal: 20,
    },
    buttonSignOut: {
        backgroundColor: "#d9902bff",
        color: "#fff",
        fontSize: 25,
        padding: 10,
        fontWeight: "bold",
        width: "50%",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 16,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#0b0b0bff',
    },
    modalTextContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        borderWidth: 1,
        borderColor: "#2c2c2cff",
    },
    expandButtonText: {
        color: '#61d76fff',
        fontSize: 13,
        fontWeight: '600',
    },
    hLine: {
        height: 1,
        backgroundColor: '#404040',
        marginVertical: 12,
    },
    reviewGameDate: {
        color: '#7a7a7aff',
        fontSize: 14,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#181818',
    },
    loadingText: {
        color: '#ccc',
        fontSize: 16,
    },
    mainView: {
        flex: 1,
        backgroundColor: '#181818',
        justifyContent: 'center',
    },
    reviewText: {
        color: '#a0a0a0ff',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    reviewDate: {
        color: '#7a7a7aff',
        fontSize: 11,
        letterSpacing: 0.6,
    },
    reviewTextName: {
        color: '#ffffffff',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    reviewTextDesc: {
        color: '#c7c7c7ff',
        fontSize: 13,
        letterSpacing: 0.5,
    },
    reviewInfo: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 10,
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        height: '20%',
        width: '100%',
    },
    displayImage: {
        width: 85,
        height: 126.6,
        margin: 2.4,
        marginTop: 10,
        borderWidth: 0.4,
        borderColor: 'gray',
        backgroundColor: '#404040',
    },
    displayText: {
        color: '#f0f0f0',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'center'
    },
});
function dispatch(arg0: { payload: GamePageDataType; type: "gameData/update"; }) {
    throw new Error('Function not implemented.');
}

