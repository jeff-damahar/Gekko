const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require("jsonwebtoken")

mongoose.connect(
    "mongodb+srv://abhi:123@cluster0.5sf3gk1.mongodb.net/",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(() => {
    console.log("connected to mongodb");
}).catch((err) => {
    console.log("error connecting to mongodb");
});

app.listen(port, () => {
    console.log("server running on port 8000");
});

const User = require("./models/user");
const Message = require("./models/message");


// endpoint for regestration of the user

app.post("/register", (req, res) => {
    const { name, email, password, image } = req.body;

    // create a new user object 
    const newUser = new User({ name, email, password, image });


    // save the user to the database
    newUser
        .save()
        .then(() => {
            res.status(200).json({ message: "User registered successfully" });
        })
        .catch((err) => {
            console.log("Error registering user", err);
            res.status(500).json({ message: "Error registering the user!" });
        });
});

//function to creat a token for the user 
const createToken = (userId) => {
    //set the token payload
    const payload = {
        userId: userId,
    };

    //generate the token with a secreat key and expiration time
    const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });

    return token;
}

// endpoint for logging in of that particular user
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // check if the mail and password are provided 
    if (!email || !password) {
        return res.status(404).json({ message: "email and the password are required! " })
    }

    // check for that user in database
    User.findOne({ email }).then((user) => {
        if (!user) {
            //user not found
            return res.status(404).json({ message: "user not found! " })
        }

        //compare the provided pass with the pass in database
        if (user.password !== password) {
            return res.status(404).json({ message: "invalid pass!!" })
        }

        const token = createToken(user._id);
        res.status(200).json({ token })
    }).catch((err) => {
        console.log("error in finding th user", err);
        res.status(500).json({ message: "internal server error" })
    })
})

//endpoint to access all the users except the currently logged in user
app.get("/users/:userId", (req, res) => {
    const loggedInUserId = req.params.userId;

    User.find({ _id: { $ne: loggedInUserId } })
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.log("Error retrieving users", err);
            res.status(500).json({ message: "Error retrieving users" });
        });
});


//endpoit to send request to user
app.post("/friend-request", async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;

    try {
        //update the recepiret's friendrequestArray
        await User.findByIdAndUpdate(selectedUserId, {
            $push: { freindRequests: currentUserId }
        })

        //update the sender's sentFriedRequestArray
        await User.findByIdAndUpdate(currentUserId, {
            $push: { sentFriendRequests: selectedUserId }
        })
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});

//endpoint to show all the friend request of a particular user
app.get("/friend-request/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        //fetch the user document based on the user id
        const user = await User.findById(userId).populate("freindRequests", "name email image").lean();

        const friendRequests = user.freindRequests;

        res.json(friendRequests)
    } catch (error) {
        console.log(error);
        res.status(500), json({ message: "internal server error" })
    }
});

// endpoint to accept a friend request of a persion

app.post("/friend-request/accept", async (req, res) => {
    try {
        const { senderId, recipientId } = req.body;

        //retrieve the documents of sender and the recepient
        const sender = await User.findById(senderId);
        const recepient = await User.findById(recipientId);


        if (!sender || !recepient) {
            return res.status(404).json({ message: "Sender or recipient not found" });
        }

        sender.friends.push(recipientId);
        recepient.friends.push(senderId);

        recepient.freindRequests = recepient.freindRequests.filter(
            (request) => request.toString() !== senderId.toString()
        );

        sender.sentFriendRequests = sender.sentFriendRequests.filter(
            (request) => request.toString() !== recipientId.toString()
        );

        await sender.save();
        await recepient.save();
        res.status(200).json({ message: "friend request accepted successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }
});


//endpoint to access all the friends
app.get("/accepted-friends/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate(
            "friends",
            "name email image"
        )
        const acceptedFriends = user.friends;
        res.json(acceptedFriends)


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" })
    }
});

const multer = require('multer');

// Cofigure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/'); // specify the desired destination folder
    },
    filename: function (req, file, cb) {
        //generate a unique filename for the upload file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

//endpoint to post Messages and store it in backend
app.post("/messages", upload.single("imageFile"), async (req, res) => {
    try {
        const { senderId, recepientId, messageType, messageText } = req.body;
        const newMessage = new Message({
            senderId,
            recepientId,
            messageType,
            message: messageText,
            timeStamp: new Date(),
            imageUrl: messageType === "image"
        });

        await newMessage.save();
        res.status(200).json({ message: "message sent successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "internal server error" });
    }
});

//endpoint to get the user details to design the chat room header
app.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        //fetch the user data from the user Id
        const recepientId = await User.findById(userId);

        res.json(recepientId)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

//endpoint to fetch the message sbetween two users in the chatroom
app.get("/messages/:senderId/:recepientId", async (req, res) => {
    try {
        const { senderId, recepientId } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: senderId, recepientId: recepientId },
                { senderId: recepientId, recepientId: senderId }
            ]
        }).populate("senderId", "_id name");

        res.json(messages)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});