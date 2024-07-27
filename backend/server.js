require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not defined');
}

mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const invoiceSchema = new mongoose.Schema({
    invoiceId: String,
    amount: Number,
    date: Date,
    items: Array,
    status: { type: String, default: 'Unpaid' }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

app.post('/invoices', async (req, res) => {
    const invoice = new Invoice(req.body);
    try {
        await invoice.save();
        res.status(201).send(invoice);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/invoices/:invoiceId', async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ invoiceId: req.params.invoiceId });
        if (!invoice) {
            return res.status(404).send();
        }
        res.send(invoice);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/invoices/:invoiceId', async (req, res) => {
    try {
        const invoice = await Invoice.findOneAndUpdate(
            { invoiceId: req.params.invoiceId },
            { status: 'Completed' },
            { new: true }
        );
        if (!invoice) {
            return res.status(404).send();
        }
        res.send(invoice);
    } catch (error) {
        res.status(500).send(error);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
