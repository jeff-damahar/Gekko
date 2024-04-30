import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const navigation = useNavigation();
    const handelRegister = () => {
        const user = {
            name: name,
            email: email,
            password: password,
            image: image
        }

        axios.post("http://localhost:8000/register", user).then((response) => {
            console.log(response);
            Alert.alert(
                "registration succesfull",
                "you have been registered succesfully"
            );
            setName("");
            setEmail("");
            setPassword("");
            setImage("");
        }).catch((err) => {
            Alert.alert(
                "registartion failded",
                "an error occurred while registering"
            );
            console.log("registration error:", err);
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
                    <Text style={{ color: '#4A55A2', fontSize: 17, fontWeight: "600" }}>Register</Text>
                    <Text style={{ color: "black", fontSize: 17, fontWeight: "600", marginTop: 15 }}>Register to Your Account</Text>
                </View>

                <View style={{ marginTop: 50 }}>
                    <Text style={{ color: "grey", fontSize: 18, fontWeight: "600" }}>Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={(Text) => setName(Text)}
                        style={{
                            color: "black",
                            borderBottomColor: "gray",
                            borderBottomWidth: 1,
                            marginVertical: 10,
                            width: 300,
                            fontSize: email ? 18 : 18
                        }}
                        placeholderTextColor={"black"} placeholder='enter your name' />

                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ color: "grey", fontSize: 18, fontWeight: "600" }}>Email</Text>
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
                        fontWeight: "600"
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
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: "grey", fontSize: 18, fontWeight: "600" }}>Image</Text>
                        <TextInput
                            value={image}
                            onChangeText={(Text) => setImage(Text)}
                            style={{
                                color: "black",
                                borderBottomColor: "gray",
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300,
                                fontSize: email ? 18 : 18
                            }}
                            placeholderTextColor={"black"} placeholder='Image' />

                    </View>
                    <Pressable
                        onPress={handelRegister}
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
                        }}>Register</Text>
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
                            Already have an account?
                        </Text>
                        <Pressable
                            onPress={() => navigation.navigate("Login")}
                            style={{}}>
                            <Text style={{
                                textAlign: 'center',
                                color: "grey",
                                fontSize: 16,
                                color: "#4A55A2"
                            }}>Log in
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({})