const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const envelopes = []
let nextEnvelopeId = 0;


app.get('/', (req,res,next)=>{
    res.send("Hello")
})

app.get('/envelopes', (req,res,next) => {
    res.status(200).send(envelopes)
})

app.get('/envelopes/:id', (req,res,next) =>{
    const id = parseInt(req.params.id);

    if (!isNaN(id) && id >= 0) {
        const result = envelopes.filter((envelope) => envelope.id === id);
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Envelope not found" });
        }
    } else {
        res.status(400).json({ message: "Invalid id entered" });
    }
})

app.post('/envelopes', (req,res,next) => {
    const {title,budget} = req.body;

    if(title && budget) {
        const envelope = {
            id:nextEnvelopeId,
            title: title,
            budget: budget
        }

        envelopes.push(envelope)
        nextEnvelopeId++;

        res.status(201).json({message: "An envelope was added to the server"})
    } else {
        res.status(400).json({message:"Check the validity of the input"})
    }
})

app.post('/envelopes/transfer/:from/:to', (req,res,next)=>{
    const fromIndex = envelopes.findIndex(envelope => 
         envelope.id === parseInt(req.params.from));
    
    const toIndex = envelopes.findIndex(envelope => 
         envelope.id === parseInt(req.params.to));

    const budget = req.body.budget
    console.log(fromIndex + ' ' + toIndex)
    console.log(req.params.from +  " " + req.params.to)
    if (fromIndex >= 0 && toIndex >= 0) {
        if (budget>0 && budget<= envelopes[fromIndex].budget) {
            envelopes[fromIndex].budget -= budget
            envelopes[toIndex].budget += budget

            res.status(200).json({from:envelopes[fromIndex], to:envelopes[toIndex]})
        } else {
            res.status(400).json({message:"Invalid number or insufficient funds on account"})
        }
    } else {
        res.status(400).json({message:"Could not find either from or index"})
    }
        
})

app.put('/envelopes/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
    const { title, budget } = req.body;

    if (!isNaN(id) && id >= 0) {
        const indexToUpdate = envelopes.findIndex(envelope => envelope.id === id);

        if (indexToUpdate !== -1) {
            const updatedEnvelope = envelopes[indexToUpdate];

            if (title !== undefined && typeof title === 'string') {
                updatedEnvelope.title = title;
            }

            if (!isNaN(budget) && isFinite(budget)) {
                updatedEnvelope.budget = budget;
            }

            res.status(204).json({ message: "Envelope updated successfully." });
        } else {
            res.status(404).json({ message: "Envelope not found." });
        }
    } else {
        res.status(400).json({ message: "Wrong id given." });
    }
});


app.delete('/envelopes/:id', (req, res, next) => {
    const id = parseInt(req.params.id);

    if (!isNaN(id)) {
        const indexToDelete = envelopes.findIndex(envelope => envelope.id === id);

        if (indexToDelete !== -1) {
            envelopes.splice(indexToDelete, 1);
            res.status(200).json({ message: "Envelope deleted successfully." });
        } else {
            res.status(404).json({ message: "Envelope not found." });
        }
    } else {
        res.status(400).json({ message: "Invalid id provided." });
    }
});


app.listen(3000, ()=> {
    console.log("Listening on port 3000")
})