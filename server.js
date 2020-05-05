const express = require('express');
const server = express();
server.use(express.json());
const shortID = require('shortid');

let users  = [
    {
        id: shortID(),
        name: "James Clark",
        bio: "I'm a web developer",
    },
];

server.get('/', (req, res) => {
    res.status(200).json({api: "API functioning"});
});

server.get('/api/users', (req, res) => {
    if(!users){
        res.status(500).json({errorMessage: "The users information could not be retrieved"});
    }
    res.status(200).json(users);
})

server.post('/api/users', (req, res) => {
    const user = {
        id: shortID(),
        ...req.body,
    }
    if(!user.name || !user.bio){
        res.status(400).json({errorMessage: "Please provide name and bio for the user"});
    }else if(!user){
        res.status(500).json({errorMessage: "There was an error while saving the user to the database"});
    };
    users.push(user);
    res.status(201).json(user);
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const verifyID = users.filter(user => user.id === id)
    if(verifyID.length === 0){
        res.status(404).json({errorMessage: "User ID not found"});
    }else if(!users){
        res.status(500).json({errorMessage: "The user with the specified ID does not exist"});
    }else{
        users = users.filter(user => user.id != id);
        res.status(200).json(users);
    };
});

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id
    const verifyID = users.filter(user => user.id === id);
    if(verifyID.length === 0){
        res.status(404).json({errorMessage: "User ID not found"});
    }else if(!users){
        res.status(500).json({errorMessage: "Internal server error, the user could not be removed"});
    }else{
        users = users.filter(user => user.id != id);
        res.status(200).json(users);
    };
});

server.patch('/api/users/:id', (req, res) => {
    const id = req.params.id
    const verifyID = users.filter(user => user.id === id);
    const newUser = req.body;
    if(verifyID.length === 0){
        res.status(404).json({errorMessage: "User ID not found"});
    }else if(!users){
        res.status(500).json({errorMessage: "Internal server error, database could not be reached"});
    }else{
        users.forEach(user => {
            if(user.id === id){
                user.name = newUser.name;
                user.bio = newUser.bio;
            }else{
                return user
            };
        });
    }
    res.status(200).json(users);
})

server.listen(3000, () => console.log("\n== API is listening on port 3000 ==\n"))