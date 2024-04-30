import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { UserType } from '../UserContext'
import { useNavigation } from '@react-navigation/native';

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
    const { userId, setUserId } = useContext(UserType);
    const navigation = useNavigation();
    const acceptRequest = async (friendRequestId) => {
        try {
            const response = await fetch(
                "http://localhost:8000/friend-request/accept",
                {
                    method: "POST",
                    headers: {
                        "content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        senderId: friendRequestId,
                        recipientId: userId
                    })
                })

            if (response.ok) {
                setFriendRequests(
                    friendRequests.filter((request) => request._id !== friendRequestId)
                );
                navigation.navigate("Chats")

            }
        } catch (error) {
            console.log("error accepting the friend request", error);
        }
    }
    return (
        <Pressable style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 15
        }}>
            <Image source={{ uri: item.image }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <Text style={{
                fontSize: 15,
                fontWeight: 'bold',
                marginLeft: 10,
                flex: 1,
                color: "black"
            }}
            >
                {item?.name} wants to be your friend
            </Text>
            <Pressable
                onPress={() => acceptRequest(item._id)}
                style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 6 }}>
                <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
            </Pressable>
        </Pressable>
    )
}

export default FriendRequest

const styles = StyleSheet.create({})