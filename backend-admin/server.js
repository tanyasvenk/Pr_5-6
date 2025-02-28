const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');


const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger документация
const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.0',
      info: {
          title: 'Task Management API',
          version: '1.0.0',
          description: 'API для управления задачами',
      },
      servers: [
          {
              url: 'http://localhost:8080',
          },
      ],
  },
  apis: [path.join(__dirname, '../openapi.yaml')],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware для безопасности
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// Работа с файлами продуктов
const productsFile = path.join(__dirname, '../shared/products.json');

const readProducts = () => {
    if (!fs.existsSync(productsFile)) {
        console.error("Файл products.json не найден!");
        return [];
    }
    return JSON.parse(fs.readFileSync(productsFile, 'utf8'));
};

const writeProducts = (data) => {
    fs.writeFileSync(productsFile, JSON.stringify(data, null, 2));
};

app.post('/api/products', (req, res) => {
    const products = readProducts();
    const newProducts = Array.isArray(req.body) ? req.body : [req.body];
    newProducts.forEach(product => {
        product.id = Date.now() + Math.floor(Math.random() * 1000);
        products.push(product);
    });
    writeProducts(products);
    res.status(201).json({ message: "Товар(ы) добавлен(ы)" });
});

app.put('/api/products/:id', (req, res) => {
    let products = readProducts();
    const id = Number(req.params.id);
    let productFound = false;
    products = products.map(p => {
        if (p.id === id) {
            productFound = true;
            return { ...p, ...req.body };
        }
        return p;
    });
    if (!productFound) {
        return res.status(404).json({ error: "Товар не найден" });
    }
    writeProducts(products);
    res.json({ message: "Товар обновлен" });
});

app.delete('/api/products/:id', (req, res) => {
    let products = readProducts();
    const id = Number(req.params.id);
    const newProducts = products.filter(p => p.id !== id);
    
    if (newProducts.length === products.length) {
        return res.status(404).json({ error: "Товар не найден" });
    }
    
    writeProducts(newProducts);
    res.json({ message: "Товар удален" });
});

app.get('/api/products', (req, res) => {
    try {
        const products = readProducts();
        res.json(products);
    } catch (error) {
        console.error("Ошибка чтения товаров:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


app.get('/', (req, res) => {
    res.send('Admin API is running');
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Swagger доступен на http://localhost:${PORT}/api-docs`);
});
