const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/products', (req, res) => {
    const productsPath = path.join(__dirname, '../shared/products.json');
    fs.readFile(productsPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Магазин работает: http://localhost:${PORT}`);
});
