const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let products = [];

function generateId() {
    return products.length ? Math.max(...products.map(product => product.id)) + 1 : 1;
}

app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).send({ error: 'Product not found' });
    res.json(product);
});

app.post('/products', (req, res) => {
    const { name, price } = req.body;
    if (!name || price == null) return res.status(400).send({ error: 'Invalid input' });

    const product = { id: generateId(), name, price };
    products.push(product);
    res.status(201).json(product);
});

app.put('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).send({ error: 'Product not found' });

    const { name, price } = req.body;
    if (name != null) product.name = name;
    if (price != null) product.price = price;

    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id == req.params.id);
    if (productIndex === -1) return res.status(404).send({ error: 'Product not found' });

    products.splice(productIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});