const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json())

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

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World!'
    });
})


let refreshTokens = [];

app.post('/api/refresh',(req,res)=>{
    const refreshToken = req.body.token;
    if(!refreshToken) return res.sendStatus(401).json({message:'No token'});
    if(refreshTokens.indexOf(refreshToken) === -1) return res.sendStatus(403).json({message:'Invalid token'});
    jwt.verify(refreshToken,'refreshSecret',(err,user)=>{
        if(err) return res.sendStatus(403).json({message:'Invalid token'});
        refreshTokens.splice(refreshTokens.indexOf(refreshToken),1);
        const accessToken = generateAccesToken(user);
        const refreshToken = genereateRefreshToken(user);
        res.json({accessToken});
    })
})

const genereateRefreshToken = (user)=>{
    const refreshToken  = jwt.sign(user, 'refreshSecret', {expiresIn: '7d'});
    return refreshToken;
}

const generateAccesToken = (user) => {
    const accessToken = jwt.sign(user, 'accessSecret', {expiresIn: '15m'});
    return accessToken;
}

app.post("/api/login", (req, res) => {
    console.log(req.body);
    const { name, password } = req?.body;
    const findUser = user.find(user => user.name === name && user.password === password);
    if (!findUser) return res.status(400).send('Invalid Credentials');
    const accessToken = generateAccesToken(findUser);
    const refreshToken = genereateRefreshToken(findUser);
    console.log(findUser);
    res.json({
        accessToken: accessToken,
        refreshToken: refreshToken
    });
})

const verify = (req, res, next) => {
    const token = req.header('bearer').split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, 'secret');
        console.log(verified, "ffffffffffffffff");
        const findUser = user.find(user => user.id === verified.id);
        console.log(findUser, "yoyo honey singh");
        if (!findUser) return res.status(400).send('Invalid Credentials');
        req.user = verified;
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