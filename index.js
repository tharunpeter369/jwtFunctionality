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

app.post("/api/login", (req, res) => {
    console.log(req.body);
    const { name, password } = req?.body;
    const findUser = user.find(user => user.name === name && user.password === password);
    if (!findUser) return res.status(400).send('Invalid Credentials');
    const token = jwt.sign({ id: findUser.id, code: "fuck yourself asslhole" }, 'secret', { expiresIn: '1h' });
    console.log(findUser);
    res.json({
        token: token
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