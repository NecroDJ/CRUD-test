const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let products = [];

function generateId() {
    return products.length ? Math.max(...products.map(product => product.id)) + 1 : 1;
}

app.get('/products', (req, res, next) => {
    try {
        res.json(products);
    } catch (err) {
        next(err);
    }
});

app.get('/products/:id', (req, res, next) => {
    try {
        const product = products.find(p => p.id == req.params.id);
        if (!product) return res.status(404).send({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        next(err);
    }
});

app.post('/products', (req, res, next) => {
    try {
        const { name, price } = req.body;
        if (!name || price == null) return res.status(400).send({ error: 'Invalid input' });

        const product = { id: generateId(), name, price };
        products.push(product);
        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
});

app.put('/products/:id', (req, res, next) => {
    try {
        const product = products.find(p => p.id == req.params.id);
        if (!product) return res.status(404).send({ error: 'Product not found' });

        const { name, price } = req.body;
        if (name != null) product.name = name;
        if (price != null) product.price = price;

        res.json(product);
    } catch (err) {
        next(err);
    }
});

app.delete('/products/:id', (req, res, next) => {
    try {
        const productIndex = products.findIndex(p => p.id == req.params.id);
        if (productIndex === -1) return res.status(404).send({ error: 'Product not found' });

        products.splice(productIndex, 1);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

app.get('/unauthorized', (req, res, next) => {
    try {
        res.status(401).send({ error: 'Unauthorized access' });
    } catch (err) {
        next(err);
    }
});

app.get('/payment-required', (req, res, next) => {
    try {
        res.status(402).send({ error: 'Payment required' });
    } catch (err) {
        next(err);
    }
});

app.get('/forbidden', (req, res, next) => {
    try {
        res.status(403).send({ error: 'Forbidden access' });
    } catch (err) {
        next(err);
    }
});

app.use((req, res, next) => {
    res.status(404).send({ error: 'Resource not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.status) {
        res.status(err.status).send({ error: err.message });
    } else {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
