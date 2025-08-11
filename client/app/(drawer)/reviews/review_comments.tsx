import { View, Text, ScrollView, Image, StyleSheet, Touchable, TouchableOpacity, Modal, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useLocalSearchParams } from 'expo-router';
import { Id } from "@/convex/_generated/dataModel";
import { Authenticated } from 'convex/react';
import { useUser } from '@clerk/clerk-expo';
import ListAddButton from '@/components/listAddButton';
import LottieView from 'lottie-react-native';

const ReviewComments = () => {
  const animation = useRef<LottieView>(null);
  const { id } = useLocalSearchParams();
  const { user } = useUser();
  const loggedInUser = useQuery(
    api.users.getUserByExternalId,
    user?.id ? { externalId: user.id } : "skip"
  );
  const reviewId: Id<"reviews"> = id as Id<"reviews">;
  const comments = useQuery(api.commentsReviews.getCommentsByReview, { reviewId });
  const addComment = useMutation(api.commentsReviews.addComment);
  const [commentText, setCommentText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  if (!comments) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#181818',
      }}>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 200,
            height: 200,
            backgroundColor: '#181818',
          }}
          source={require('@/assets/animations/batman.json')}
        />
      </View>
    );
  }
  if (comments?.length === 0) {
    return (
      <>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#181818' }}>
          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)'
            }}>
              <View style={{
                width: '80%',
                backgroundColor: '#2a2a2aff',
                borderRadius: 10,
                padding: 20,
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#fff' }}>Add Comment</Text>
                <View style={{
                  width: '100%',
                  borderWidth: 1,
                  borderColor: '#545454ff',
                  borderRadius: 8,
                  marginBottom: 16,
                  paddingHorizontal: 8,
                  paddingVertical: 4
                }}>
                  <TextInput
                    placeholder="Type your comment..."
                    placeholderTextColor={'#aaa'}
                    value={commentText}
                    onChangeText={text => {
                      if (text.length <= 200) setCommentText(text);
                    }}
                    style={{ minHeight: 70, color: '#fff', fontSize: 12 }}
                    multiline
                    maxLength={200}
                  />
                  <Text style={{ alignSelf: 'flex-end', color: '#aaa', fontSize: 12 }}>
                    {commentText.length}/200
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsModalVisible(false)
                      setCommentText("");
                    }}
                    style={{
                      backgroundColor: '#404040ff',
                      padding: 10,
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ color: '#fff' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      if (!commentText.trim()) {
                        alert("Please enter a comment before saving.");
                        return;
                      }
                      if (isSaving) return;
                      setIsSaving(true);
                      await addComment({
                        userId: loggedInUser?._id as Id<"users">,
                        reviewId,
                        commentText,
                        userName: loggedInUser?.name || "Anonymous",
                        userImageUrl: loggedInUser?.imageUrl || ""
                      });
                      setCommentText("");
                      setIsModalVisible(false);
                      setTimeout(() => setIsSaving(false), 800);
                    }}
                    style={{
                      backgroundColor: '#181818',
                      padding: 10,
                      paddingHorizontal: 15,
                      borderRadius: 6
                    }}
                  >
                    <Text style={{ color: '#fff' }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Text style={{ color: '#aaa' }}>No comments yet.</Text>
          <Authenticated>
            {user && (
              <TouchableOpacity onPress={() => setIsModalVisible(true)} style={{ position: 'absolute', bottom: 35, right: 20 }}>
                <ListAddButton />
              </TouchableOpacity>
            )}
          </Authenticated>
        </View>
      </>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: '#181818' }} style={{ flex: 1 }}>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            width: '80%',
            backgroundColor: '#2a2a2aff',
            borderRadius: 10,
            padding: 20,
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#fff' }}>Add Comment</Text>
            <View style={{
              width: '100%',
              borderWidth: 1,
              borderColor: '#545454ff',
              borderRadius: 8,
              marginBottom: 16,
              paddingHorizontal: 8,
              paddingVertical: 4
            }}>
              <TextInput
                placeholder="Type your comment..."
                placeholderTextColor={'#aaa'}
                value={commentText}
                onChangeText={text => {
                  if (text.length <= 200) setCommentText(text);
                }}
                style={{ minHeight: 70, color: '#fff', fontSize: 12 }}
                multiline
                maxLength={200}
              />
              <Text style={{ alignSelf: 'flex-end', color: '#aaa', fontSize: 12 }}>
                {commentText.length}/200
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false)
                  setCommentText("");
                }}
                style={{
                  backgroundColor: '#404040ff',
                  padding: 10,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: '#fff' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  if (!commentText.trim()) {
                    alert("Please enter a comment before saving.");
                    return;
                  }
                  if (isSaving) return;
                  setIsSaving(true);
                  await addComment({
                    userId: loggedInUser?._id as Id<"users">,
                    reviewId,
                    commentText,
                    userName: loggedInUser?.name || "Anonymous",
                    userImageUrl: loggedInUser?.imageUrl || ""
                  });
                  setCommentText("");
                  setIsModalVisible(false);
                  setTimeout(() => setIsSaving(false), 800);
                }}
                style={{
                  backgroundColor: '#181818',
                  padding: 10,
                  paddingHorizontal: 15,
                  borderRadius: 6
                }}
              >
                <Text style={{ color: '#fff' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {comments?.map((comment) => (
          <View key={comment?._id}>
            <View style={{ flexDirection: 'row', marginTop: 16, paddingHorizontal: 16 }}>
              <View style={{ flex: 1, marginRight: 4 }}>
                <Image
                  source={{ uri: comment?.userImageUrl || "https://via.placeholder.com/150" }}
                  style={{ width: 30, height: 30, borderRadius: 20 }}
                />
              </View>
              <View style={{ flex: 5 }}>
                <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginBottom: 4, gap: 10 }}>
                  <Text style={{ fontWeight: 'bold', color: '#696969ff' }}>{comment?.userName}</Text>
                  <Text style={{ color: '#a3a3a3ff', fontSize: 12 }}>{comment?.commentText}</Text>
                </View>
              </View>
              <View>
                <Text style={{ color: '#696969ff', fontSize: 10, textAlign: 'right' }}>
                  {new Date(comment?._creationTime || "").toLocaleDateString("en-US", {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: '#3d3d3dff', marginTop: 10, marginLeft: 62 }} />
          </View>
        ))}
      </ScrollView>
      {loggedInUser && (
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={{ position: 'absolute', bottom: 35, right: 20 }}>
          <ListAddButton />
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

export default ReviewComments