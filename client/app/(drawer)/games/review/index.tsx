import { View, Image, Text, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native'
import React, { useRef, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import type { RootState } from '@/redux/store'
import { useAppSelector } from '@/redux/hooks'
import StarRating from 'react-native-star-rating-widget'
import { Ionicons } from '@expo/vector-icons'
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";


const Review = () => {
    const [rating, setRating] = useState(0);
    const gamePage = useAppSelector((state: RootState) => state.gamePageData.data)
    const richText = useRef<RichEditor>(null);

    return (
        <ScrollView style={{ padding: 18, backgroundColor: '#1e1e1eff' }} showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <View style={{ flex: 1, flexDirection: 'column', gap: 6, paddingRight: 10 }}>
                    <Text style={{ fontSize: 17, color: 'white' }}>
                        {gamePage?.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#a0a0a0ff' }}>
                        {gamePage?.first_release_date ? new Date(gamePage.first_release_date * 1000).getFullYear() : ''}
                    </Text>
                </View>
                <Image
                    source={{ uri: 'https:' + gamePage?.cover?.url.replace('t_thumb', 't_cover_big_2x') }}
                    style={{ width: 35, height: 49.58, borderWidth: 1, borderColor: '#333' }}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.hLine} />
            <View style={{ flex: 1, marginTop: 17, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Text style={{ fontSize: 15, color: '#a0a0a0ff' }}>
                    Date
                </Text>
                <Text style={{ fontSize: 16, letterSpacing: 0.5, color: '#a0a0a0ff' }}>
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Text>
            </View>
            <View style={styles.hLine} />
            <View style={{ flex: 1, marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <View >
                    <StarRating
                        rating={rating}
                        starStyle={{ marginHorizontal: -3 }}
                        onChange={setRating}
                        starSize={50}
                        enableHalfStar={true}
                        emptyColor="#555555ff"
                        color="#61d76fff"
                    />
                    <Text style={{ fontSize: 12, color: '#a0a0a0ff', textAlign: 'left', paddingLeft: 5 }}>Rated</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="heart-outline" size={50} color="#555555ff" />
                    <Text style={{ fontSize: 12, color: '#a0a0a0ff', textAlign: 'center' }}>Like</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.hLine} />
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : undefined} 
                style={{ flex: 1, paddingVertical: 20 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
                <RichToolbar
                    style={{ backgroundColor: '#1e1e1eff', borderTopWidth: 1, borderTopColor: '#333', paddingVertical: 10 }}
                    editor={richText}
                    actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.blockquote, actions.undo, actions.redo]}
                />
                <RichEditor
                    ref={richText}
                    onChange={descriptionText => {
                        console.log("descriptionText:", descriptionText);
                    }}
                    placeholder="Add Review"
                    editorStyle={{
                        backgroundColor: '#1e1e1eff',
                        color: 'white',
                        placeholderColor: '#a9a9a9ff',
                    }}
                />
            </KeyboardAvoidingView>

        </ScrollView>
    )
}

export default Review

const styles = {
    hLine: {
        height: 1,
        backgroundColor: '#333',
        marginTop: 12,
        marginHorizontal: -18
    },
};  