const express = require("express")
const router = express.Router()

const {
    getAllTransactions,
    getTransactionById,
    deleteTransactionById
} = require("../controllers/transactions")

router.get('/', getAllTransactions)

router.get('/:id', getTransactionById)

router.delete('/:id', deleteTransactionById)

module.exports = router