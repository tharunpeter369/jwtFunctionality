const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json())

const user = [
    {   
        id: 1,
        name: "raju",
        password:'33dd'
    },
    {
        id: 2,
        name: "tharun",
        password:'33ddf3d'
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
    if(!findUser) return res.status(400).send('Invalid Credentials');
    const token = jwt.sign({ id: findUser.id }, 'secret', { expiresIn: '1h' });
    console.log(token);
    res.json({
        token: token
    });
})

app.listen(3007,()=>{
    console.log('Server is running on port 3007');
})