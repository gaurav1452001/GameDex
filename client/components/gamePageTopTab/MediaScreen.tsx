import { View, StyleSheet, Image, Text, Modal, TouchableOpacity } from 'react-native';
import type { RootState } from '@/redux/store'
import { useAppSelector } from '@/redux/hooks'
import { ScrollView } from 'react-native-gesture-handler';
import { useState } from 'react';

export default function MediaScreen() {
    const gamePage = useAppSelector((state: RootState) => state.gamePageData.data);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedScreenshot, setSelectedScreenshot] = useState<{ id: number; url: string; } | null>(null);
    return (
            <ScrollView style={styles.tabContent}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {gamePage?.screenshots?.map((screenshot, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{
                                width: '48%',
                                height: 100,
                                marginBottom: 10,
                                borderRadius: 3,
                                backgroundColor: '#383838ff',
                            }}
                            onPress={() => {
                                setSelectedScreenshot(screenshot);
                                setModalVisible(true);
                            }}>
                            <Image
                                source={{ uri: 'https:' + screenshot.url.replace('t_thumb', 't_screenshot_huge') }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>

                    )) || (
                            <Text>
                                No screenshots available
                            </Text>
                        )}
                </View>
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <Image
                        source={{ uri: 'https:' + selectedScreenshot?.url.replace('t_thumb', 't_screenshot_huge') }}
                        style={styles.modalImage}
                        resizeMode="contain"
                    />
                </View>
            </Modal>
            </ScrollView>
    );
}


const styles = StyleSheet.create({
    tabContent: {
        flex: 1,
        backgroundColor: '#181818',
        paddingVertical: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalImage: {
        width: '100%',
        height: '70%',
    },
});
