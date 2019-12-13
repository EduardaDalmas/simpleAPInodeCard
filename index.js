const express = require('express');
const database = require('./database');
const cors = require('cors');
require('dotenv').config();

const server = express();

server.use(express.json());

server.use(cors());

server.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

//midle
async function lastId(req, res, next) {
    await database.query(`SELECT MAX(id) AS id FROM cards` , { type: database.QueryTypes.SELECT } )
    .then(results => {
        nextId = results[0].id;
    });

    next();
}

function checkCard(req, res, next) {
    const {id} = req.params;
    const card = cards.find(card => card.id == id);

    if(!card) {
        return res.json({error: "card not found."});
    }

    next();
};

let nextId = 0;
let cards =[];

//routes
server.get("/", (req, res) => {
    return res.json({result: "NodeAPI" });
});

server.get("/cards", lastId, async (req, res) => {
    await database.query(`SELECT * FROM cards` , { type: database.QueryTypes.SELECT } )
    .then(results => {
        cards = results;
    });
    return res.json(cards);
});

server.post ("/cards", lastId, (req, res) => {
    nextId++;
    const {title, content} = req.body;
    let card = {
        id: nextId,
        title,
        content
    };

    database.query(`INSERT INTO cards VALUES ( ${nextId}, '${title}' , '${content}');`,
        { type: database.QueryTypes.INSERT } 
    )
    .then(results => {
        nextId = results[0].id;
    });

    cards.push(card);

    nextId++;

    return res.json(card);
});

server.put("/cards/:id", checkCard, (req, res) => {
    const {id} = req.params;
    const {title, content} = req.body;
    let updated = false;

    const card = cards.find(card => card.id == id);

    if(title) {
        card.title = title;
        updated = true;
    }

    if(content) {
        card.content = content;
        updated = true;
    }

    if(updated) {
        database.query(`UPDATE cards SET title = '${card.title}', content = '${card.content}' WHERE  id = ${id}`,
            { type: database.QueryTypes.UPDATE}
        )
        .then(update => {
            console.log(update);
        });
    };

    return res.json(cards);
});

server.delete("/cards/:id", checkCard, async (req, res) => {

    const {id} = req.params;

    const cardIndex = cards.findIndex(card => card.id == id);

    cards.splice(cardIndex, 1);

    res.json(cards);

    await database.query(`DELETE FROM cards WHERE id = ${id};`,
        { type: database.QueryTypes.DELETE } 
    );

    
});

server.listen(process.env.PORT);
