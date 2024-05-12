import { View, Text, KeyboardAvoidingView, ScrollView, TextInput, Pressable, Image } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import EmojiSelector from 'react-native-emoji-selector';
import { UserType } from '../UserContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const ChatMessagesScreen = () => {

    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [messages, setMessages] = useState([]);
    const [recepientData, setRecepientData] = useState();
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState("");
    const route = useRoute();
    const { recepientId } = route.params
    const [message, setMessage] = useState("")
    const { userId, setUserId } = useContext(UserType);

    const handelEmojiPress = () => {
        setShowEmojiSelector(!showEmojiSelector)
    };

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:8000/messages/${userId}/${recepientId}`);
            const data = await response.json();

            if (response.ok) {
                setMessages(data)
            } else {
                console.log("error showing messages", response.status.message);
            }
        } catch (e) {
            console.log("error fetching message", e);
        }
    }

    useEffect(() => {
        fetchMessages();
    }, [])

    useEffect(() => {
        const fetchRecepientData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/user/${recepientId}`);

                const data = await response.json();
                setRecepientData(data);
            } catch (e) {
                console.log("error retreving details", e);
            }
        };
        fetchRecepientData();
    }, [])
    const handelSend = async (messageType, imageUri) => {
        try {
            const formData = new FormData();
            formData.append("senderId", userId);
            formData.append("recepientId", recepientId);

            //if the message type is image or text
            if (messageType === "image") {
                formData.append("messageType", "image");
                formData.append("imageFile", {
                    uri: imageUri,
                    name: "image.jpg",
                    type: "image/jpg"
                })
            } else {
                formData.append("messageType", "text");
                formData.append("messageText", message)
            }

            const response = await fetch("http://localhost:8000/messages", {
                method: "POST",
                body: formData
            })

            if (response.ok) {
                setMessage("")
                setSelectedImage("");
            }
        } catch (error) {
            console.log("error in sending the message: ", error);
        }
    };

    console.log("messages: ", messages);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Icon
                        onPress={() => navigation.goBack()}
                        name='arrow-back' size={24} color="black" />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                resizeMode: 'cover'
                            }}
                            source={{ uri: recepientData?.image }}
                        />

                        <Text style={{
                            color: "black",
                            marginLeft: 5,
                            fontSize: 15,
                            fontWeight: 'bold'
                        }}
                        >{recepientData?.name}</Text>
                    </View>
                </View>
            )
        })
    }, [recepientData])
    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options)
    }
    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
            <ScrollView>
                {messages.map((item, index) => {
                    if (item.messageType === "text") {
                        return (
                            <Pressable
                                key={index}
                                style={[
                                    item?.senderId?._id === userId ? {
                                        alignSelf: 'flex-end',
                                        backgroundColor: "#DCF8C6",
                                        padding: 10,
                                        maxWidth: "60%",
                                        borderRadius: 7,
                                        margin: 10
                                    }
                                        : {
                                            alignSelf: 'flex-start',
                                            backgroundColor: "white",
                                            padding: 8,
                                            margin: 10,
                                            borderRadius: 7,
                                            maxWidth: "60%"
                                        }
                                ]}>
                                <Text style=
                                    {{
                                        color: "black",
                                        fontSize: 13
                                    }}
                                >{item?.message}</Text>
                                <Text style=
                                    {{
                                        color: "gray",
                                        fontSize: 9,
                                        marginTop: 5
                                    }}>{formatTime(item.timeStamp)}</Text>
                            </Pressable>
                        );
                    }
                })}
            </ScrollView>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderTopColor: "#dddddd",
                    marginBottom: showEmojiSelector ? 0 : 20
                }}>
                <Icon name="emoji-emotions" size={30} color="gray"
                    style={{ marginRight: 5 }}
                    onPress={handelEmojiPress}
                />

                <TextInput
                    color={"black"}
                    placeholderTextColor={"gray"}
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    style={{
                        flex: 1,
                        height: 40,
                        borderWidth: 1,
                        borderColor: "#dddddd",
                        borderRadius: 20,
                        paddingHorizontal: 10,

                    }}
                    placeholder='Message' />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginHorizontal: 8 }}>
                    <Icon name="mic" size={30} color="gray" />
                    <Icon name="camera-alt" size={30} color="gray" />
                </View>
                <Pressable
                    onPress={() => handelSend("text")}
                    style={{
                        backgroundColor: "#007bff",
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 20,
                    }}>
                    <Text style={{ fontWeight: 'bold', color: "white" }}>
                        Send
                    </Text>
                </Pressable>
            </View>
            {showEmojiSelector && (
                <EmojiSelector
                    onEmojiSelected={(emoji) => {
                        setMessage((prevMessage) => prevMessage + emoji)
                    }}
                    style={{ height: 300 }}
                />
            )}
        </KeyboardAvoidingView>
    )
}

export default ChatMessagesScreen