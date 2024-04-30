import { decode as atob, encode as btoa } from 'base-64';
global.atob = atob;
global.btoa = btoa;
import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { UserType } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import User from '../components/User';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { userId, setUserId } = useContext(UserType);
    const [users, setUsers] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => <Text></Text>,
            headerLeft: () => <Text
                style={{
                    color: "black",
                    fontSize: 18,
                    fontWeight: 'bold'
                }}>
                Snail
            </Text>,
            headerRight: () => <View style={{
                alignItems: 'center',
                flexDirection: 'row',
                gap: 13
            }}>
                <Icon
                    onPress={() => {
                        navigation.navigate("Chats")
                    }}
                    name="chatbubble-ellipses-outline" size={30} color="black" />
                <Icon onPress={() => {
                    navigation.navigate("Friends")
                }} name="people-outline" size={30} color="black" />
            </View>
        })
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                const userId = decodedToken.userId;
                setUserId(userId);

                const response = await axios.get(`http://localhost:8000/users/${userId}`);
                setUsers(response.data);
            } catch (error) {
                console.log("Error retrieving users", error.message);
            }
        };
        fetchUsers();
    }, []);

    console.log("users", users);
    return (
        <View>
            <View style={{ padding: 10 }}>
                {users.map((item, index) => (
                    <User key={index} item={item} />
                ))}
            </View>
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({});
