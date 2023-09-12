const {db} = require("../config");

exports.getEnvelopes = async (req,res) => {
    const query = "SELECT * FROM envelopes";

    try {
        const envelopes = await db.query(query);
        if (envelopes.rowCount<1) {
            return res.status(404).send({
                message:"Records not found"
            })
        }
        res.status(200).send({
            status: 'Success',
            message: 'Envelopes Information retrieved',
            data: envelopes.rows,
        });
    } catch (err) {
        res.status(500).send({
            error: err.message
        })
    }
}

exports.getEnvelopesById = async (req,res) => {
    const query = "SELECT * FROM envelopes where id = $1";
    const {id} = req.params;

    try {
        const envelope = await db.query(query, [id]);
        if(envelope.rowCount < 1) {
            res.status(404).send({
                message:"No envelope information found"
            });
        }
        res.status(200).send({
            status: 'Success',
            message: 'Envelope Information retrieved',
            data: envelope.rows[0],
        });
    } catch (err) {
        res.status(500).send({
            error: err.message
        });
    }
};

exports.postEnvelope = async (req,res) => {
    const query = "INSERT INTO envelopes (title, budget) VALUES ($1, $2) RETURNING *"
    const {title,budget} = req.body;
    const values = [title,budget]

    try {
        const result = await db.query(query, values)
        const insertedProduct = result.rows[0]

        res.status(201).send({
            status:"Success",
            message: "Product inserted successfully",
            data: insertedProduct,
        });
    } catch (err) {
        console.error('Error inserting product:', err)
        res.status(500).send({
            error:"Internal server error"
        })
    }
}

exports.putEvenlope = async (req,res) => {
    const envelopeId = req.params.id;
    const {title, budget} = req.body;
    try {
        const query = "UPDATE envelopes SET title = $1, budget = $2 WHERE id = $3 RETURNING *"
        const values = [title,budget,envelopeId]
        const result = await db.query(query, values);

        if(result.rowCount === 0) {
            res.status(404).send({message:'Envelope not found'});
        }

        const updatedEnvelope = result.rows[0]

        res.status(200).send({
            status:"Success",
            message: "Envelope updated successfully",
            data: updatedEnvelope,
        })
    } catch (err) {
        console.error('Error updating envelope:', error);
        res.status(500).json({ error: 'Internal server error' });
    } 
}

exports.deleteEnvelope = async (req,res) =>{
    const envelopeId = req.params.id;

    try {
        const query = "DELETE FROM envelopes WHERE id = $1"
        
        const result = await db.query(query, [envelopeId])

        if(result.rowCount === 0) {
            res.status(404).send({
                status: "Not Found",
                message: "Envelope not found",
            })
        }

        res.status(204).send();
    } catch (err) {
        console.error('Error deleting envelope:', err);
        res.status(500).send({
            status: "Error",
            message: "Internal server error",
            data: null
          });
    }
}
    