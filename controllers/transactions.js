const { query } = require("express")
const {db} = require("../config")

exports.getAllTransactions = async (req,res) => {
    const query = "SELECT * FROM transactions";

    try {
        const transactions = await db.query(query)

        if (transactions.rowCount < 1) {
            res.status(404).send({
                message:"Records not found"
            })
        }

        res.status(200).send({
            status:"Success",
            message:"Records retrieved successfully",
            data: transactions
        })

    } catch (error) {
        res.status(500).send({
                error:error.message
            })
    }
}

exports.getTransactionById = async (req,res) => {
    const {id} = req.params;
    const query = "SELECT * FROM transactions WHERE id = $1";

    try {
        const transaction = await db.query(query, [id])
    
        if (transaction.rowCount < 1) {
            res.status(404).send({
                message:"Record not found"
            })
        }

        res.status(200).send({
            status:"Success",
            message:"Record retrieved successfully",
            data: transaction
        })
        
    } catch (error) {
        res.status(500).send({
                error:error.message
            })
    }
}

exports.deleteTransactionById = async (req, res) => {
    const {id} = req.params;
    const transactionQuery = "DELETE FROM transactions WHERE id = $1"

    try{
        const transaction = await db.query(transactionQuery, [id])

        if (transaction && transaction.rowCount === 0 && transaction.rowCount !== undefined) {
            return res.status(404).send({
            message: "No transaction found with the specified ID",
            });
        }
    
        res.status(200).send({
            message: `Transaction with ID ${id} has been deleted`,
        });
            
    } catch (error) {
        res.status(500).send({
            Error: error.message
        })
    }
}