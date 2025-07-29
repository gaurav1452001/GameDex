import { useClerk } from "@clerk/clerk-expo";
import { useRouter} from "expo-router";
import { useState } from "react";
import { BlurView } from "expo-blur";

import {
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const SignOutModal = () => {
    const { signOut } = useClerk();
    const router = useRouter();

    const [modalVisible, setModalVisible] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace("/");
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    return (
        <>
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                            Are you sure you want to sign out?
                        </Text>
                        <View style={styles.modalTextContainer}>
                            <TouchableOpacity
                                style={styles.buttonClose}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonSignOut}
                                onPress={handleSignOut}
                            >
                                <Text style={styles.textStyle}>Sign Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity
                onPress={() => {
                    router.push("/");
                    setModalVisible(true);
                }}
                style={{
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    paddingHorizontal: 16,
                    marginVertical: 5,
                    borderRadius: 10,
                }}>
                <Ionicons name="log-out-outline" color={"#9f9f9fff"} size={19} />
                <Text style={{ color: "#9f9f9fff" }}>Sign out</Text>
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(3, 3, 3, 0.65)",
    },
    drawerText: {
        color: "#9f9f9fff",
    },
    modalView: {
        marginHorizontal: 20,
        paddingTop: 20,
        backgroundColor: "#343434ff",
        borderRadius: 8,
        overflow: "hidden",
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
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
    buttonSignOut: {
        backgroundColor: "#7766bdff",
        color: "#fff",
        fontSize: 25,
        padding: 10,
        fontWeight: "bold",
        width: "50%",
    },
});
