const express = require('express');

const server = express();

server.use(express.json());

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

let nextId = 1;
const cards =[];

//routes
server.get("/", (req, res) => {
    return res.json({result: "NodeAPI" });
});

server.get("/cards", (req, res) => {
    return res.json(cards);
});

server.post ("/cards", (req, res) => {
    const {title, content} = req.body;
    const card = {
        id: nextId,
        title,
        content
    };

    cards.push(card);

    nextId++;

    return res.json(card);
});

server.put("/cards/:id", (req, res) => {
    const {id} = req.params;
    const {title, content} = req.body; 

    const card = cards.find(card => card.id = id);

    if(!card) {
        return res.json({error: "card not found."});
    }

    console.log(title);
    if(title) {
        card.title = title;
    }

    console.log(content);
    if (content) {
        card.content = content;
    }


    return res.json(card);
});

server.listen(3333);
