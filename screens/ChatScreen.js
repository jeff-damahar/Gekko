import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import User from '../components/User';
import UserChat from '../components/UserChat';

const ChatScreen = () => {
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const { userId, setUserId } = useContext(UserType);
    const navigation = useNavigation();


    const acceptedFriendsList = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/accepted-friends/${userId}`
            )
            const data = await response.json();

            if (response.ok) {
                setAcceptedFriends(data);
            }
        } catch (err) {
            console.log("error showing the accepted friends: ", err);
        }
    }
    useEffect(() => {
        acceptedFriendsList();
    }, []);
    useEffect(() => {
        console.log("friends", acceptedFriends);
    }, [acceptedFriends])
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable>
                {acceptedFriends.map((item, index) => (
                    <UserChat key={index} item={item} />
                ))}
            </Pressable>

        </ScrollView>
    )
}

export default ChatScreen