const express = require("express")
const router = express.Router()

const{
    getEnvelopes,
    getEnvelopesById,
    postEnvelope,
    putEvenlope,
    deleteEnvelope,
    addEnvelopeTransaction,
} = require("../controllers/envelopes")

router.get('/', getEnvelopes)

router.get('/:id', getEnvelopesById)

router.post('/', postEnvelope)

router.put('/:id', putEvenlope)

router.delete('/:id', deleteEnvelope)

router.post('/addTransaction', addEnvelopeTransaction)

module.exports = router;