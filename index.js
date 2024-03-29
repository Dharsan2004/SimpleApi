const express = require("express");
const app = express();
const mongoClient = require("mongoose");

const fs = require("fs");

app.use(express.urlencoded({ extended: true }));

// mongoClient
//     .connect("mongodb://127.0.0.1:27017/UserAPI")
//     .then((req, res) => {
//         console.log("the DB is connected");
//     })
//     .catch((err) => {
//         console.log("the DB is not connected");
//     });

// const mongoScheme = new mongoClient.Schema(
//     {
//         Name: {
//             type: "string",
//             required: true,
//         },
//         RegNo: {
//             type: "string",
//             required: true,
//         },

//         password: {
//             type: "string",
//             required: true,
//         },
//     },
//     { timestamps: true }
// );

// const User = mongoClient.model("user", mongoScheme);

app.use((req, res, next) => {
    const content = req.url + " " + Date.now() + " \n";
    fs.appendFile("./Log.txt", content, () => {
        next();
    });
});

app.get("/", (req, res) => {
    res.send("<b> Home Page </b>");
});

app.get("/users", async (req, res) => {
    const usrs = await User.find({});
    res.send(usrs);
});

app.route("/user/:id")
    .get(async (req, res) => {
        const curId = req.params.id;
        console.log(curId);

        const allUser = await User.find({});
        const curUser = allUser.find((data) => {
            return data.RegNo == curId;
        });
        //console.log(allUser);

        res.send(curUser);
    })
    .post(async (req, res) => {
        const name = req.body.name;
        const regNo = req.body.regNo;
        const password = req.body.password;

        const newData = new User({
            Name: name,
            RegNo: regNo,
            password: password,
        });
        await newData.save();

        res.send("posted");
    });

app.listen(3000, () => {
    console.log("the server is running");
});
