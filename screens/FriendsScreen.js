import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserType } from '../UserContext';
import FriendRequest from '../components/FriendRequest';

const FriendsScreen = () => {

    const { userId, setUserId } = useContext(UserType);
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        fetchFriendRequests()
    }, [])

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/friend-request/${userId}`);
            if (response.status === 200) {
                const freindRequestsData = response.data.map((friendRequest) => ({
                    _id: friendRequest._id,
                    name: friendRequest.name,
                    email: friendRequest.email,
                    image: friendRequest.image
                }))
                setFriendRequests(freindRequestsData)
            }
        } catch (error) {
            console.log("error message", error);
        }
    }

    console.log(friendRequests);
    return (
        <View style={{ padding: 10 }}>
            {friendRequests.length > 0 &&
                <Text style={{ color: "black" }}>your friend request!</Text>}

            {friendRequests.map((item, index) => (
                <FriendRequest
                    key={index}
                    item={item}
                    friendRequests={friendRequests}
                    setFriendRequests={setFriendRequests}
                />
            ))}
        </View>
    )
}

export default FriendsScreen

const styles = StyleSheet.create({})