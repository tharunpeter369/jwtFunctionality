const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
// var cookieParser = require('cookie-parser')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');


const user = [
    {
        id: 1,
        name: "raju",
        password: '33dd'
    },
    {
        id: 2,
        name: "tharun",
        password: '33ddf3d'
    }
]

// app.use(cookieParser())

// const refreshTokens = localStorage.setItem('refreshTokens', ["fuck you"]);

// console.log(localStorage.getItem('refreshTokens'));

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World!'
    });
})


app.post('/api/refresh',(req,res)=>{
    console.log(req.body,"should be refresh token");
    const refreshToken = req.body.token;
    if(!refreshToken){
        return res.json("you are fucked")
    }
    console.log(refreshTokens,"😅");
    if(refreshTokens.indexOf(refreshToken) === -1) return res.sendStatus(403).json({message:'Invalid token'});
    jwt.verify(refreshToken,'refreshSecret',(err,user)=>{
        if(err) return res.sendStatus(403).json({message:'Invalid token'});
        refreshTokens.splice(refreshTokens.indexOf(refreshToken),1);
        const accessToken = generateAccesToken(user);
        const refreshToken = genereateRefreshToken(user);
        refreshToken.push(refreshToken);
        res.status(200).json({accessToken,refreshToken});
    })
})

const genereateRefreshToken = (user)=>{
    const refreshToken  = jwt.sign(user, 'refreshSecret', {expiresIn: '2m'});
    return refreshToken;
}

const generateAccesToken = (user) => {
    const accessToken = jwt.sign(user, 'accessSecret', {expiresIn: '15m'});
    return accessToken;
}

app.post("/api/login", (req, res) => {
    console.log(req.body,"😅😇😅😇😅😇😅😇😅😇😅😇😅😇");
    const { name, password } = req?.body;
    const findUser = user.find(user => user.name === name && user.password === password);
    if (!findUser) return res.status(400).send('Invalid Credentials');
    const accessToken = generateAccesToken(findUser);
    const refreshToken = genereateRefreshToken(findUser);
    console.log(refreshToken,"😅😇😅😇😅😇😅😇😅😇😅😇😅😇");
    refreshTokens.push(refreshToken);
    console.log(refreshTokens);
    res.json({
        accessToken: accessToken,
        refreshToken: refreshToken
    });
})

const verify = (req, res, next) => {
    // console.log(req.header,"its my token");
    console.log(req.header('bearer'));
    const token = req.header('bearer');
    // const token = req.header('bearer').split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, 'accessSecret');
        const findUser = user.find(user => user.id === verified.id);
        if (!findUser) return res.status(400).send('Invalid Credentials');
        req.user = verified;
        console.log(req.user,"😉");
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}


app.delete('/api/delete/:id', verify, (req, res) => {
    if (req.user.id == req.params.id) {
        res.json({
            message: 'Deleted'
        });
    }else{
        res.status(401).send('Access Denied');
    }
}
)

app.listen(3007, () => {
    console.log('Server is running on port 3007');
})