import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (token) {
                    navigation.replace("Home")
                } else {
                    //token not found, show the login scree itself
                }
            } catch (error) {
                console.log("error", error);
            }
        };
        checkLoginStatus();
    }, [])

    const handleLogin = () => {
        const user = {
            email: email,
            password: password
        }

        axios.post("http://localhost:8000/login", user).then((response) => {
            console.log(response);
            const token = response.data.token
            AsyncStorage.setItem("authToken", token)

            navigation.replace("Home");
        }).catch((error) => {
            Alert.alert("login error", "invalid email or password")
            console.log('login error: ', error);
        })
    }
    return (
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 10,
            alignItems: 'center'
        }}>
            <KeyboardAvoidingView>
                <View style={{ marginTop: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#4A55A2', fontSize: 17, fontWeight: "600" }}>Sign In</Text>
                    <Text style={{ color: "black", fontSize: 17, fontWeight: "600", marginTop: 15 }}>Sign In to Your Account</Text>
                </View>

                <View style={{ marginTop: 50 }}>
                    <Text style={{
                        color: "grey",
                        fontSize: 18,
                        fontWeight: "600",
                        marginLeft: 4
                    }}>
                        Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={(Text) => setEmail(Text)}
                        style={{
                            color: "black",
                            borderBottomColor: "gray",
                            borderBottomWidth: 1,
                            marginVertical: 10,
                            width: 300,
                            fontSize: email ? 18 : 18
                        }}
                        placeholderTextColor={"black"} placeholder='enter your email' />

                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={{
                        color: "grey",
                        fontSize: 18,
                        fontWeight: "600",
                        marginLeft: 4,
                    }}>Password</Text>
                    <TextInput
                        value={password}
                        onChangeText={(Text) => setPassword(Text)}
                        secureTextEntry={true}
                        style={{
                            color: "black",
                            borderBottomColor: "gray",
                            borderBottomWidth: 1,
                            marginVertical: 10,
                            width: 300,
                            fontSize: email ? 18 : 18
                        }}
                        placeholderTextColor={"black"} placeholder='Password' />
                    <Pressable
                        onPress={handleLogin}
                        style={{
                            width: 200,
                            backgroundColor: "#4A55A2",
                            padding: 15,
                            marginTop: 50,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            borderRadius: 6
                        }}>
                        <Text style={{
                            color: "white",
                            fontSize: 16,
                            fontWeight: "bold",
                            textAlign: 'center',
                        }}>Login</Text>
                    </Pressable>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 15,
                        gap: 3,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            color: "grey",
                            fontSize: 16,
                        }}>
                            don't have an account
                        </Text>
                        <Pressable
                            onPress={() => navigation.navigate("Register")}
                            style={{}}>
                            <Text style={{
                                textAlign: 'center',
                                color: "grey",
                                fontSize: 16,
                                color: "#4A55A2"
                            }}>Sign Up
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({})