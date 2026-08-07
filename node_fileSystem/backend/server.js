const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// products.txt lives next to this file, regardless of where `node` is run from
const PRODUCTS_FILE = path.join(__dirname, 'products.txt');

app.use(cors());
app.use(express.json());

// Serve the frontend from the same origin as the API (avoids CORS entirely
// and means you can just open http://localhost:3000 in the browser)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Helper to turn a product body into the text block we store on disk
function formatProduct({ name, material, score }) {
    return `Product: ${name}\nMaterial: ${material}\nSustainability Score: ${score}`;
}

function isValidProduct(body) {
    return body && body.name && body.material && body.score;
}

// READ ---------------------------------------------------------------
app.get('/products', (req, res) => {
    fs.readFile(PRODUCTS_FILE, 'utf-8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).send('No products file found yet.');
            }
            return res.status(500).send(err.message);
        }
        res.send(data);
    });
});

// WRITE (creates/overwrites the file with a single product) -----------
app.post('/products', (req, res) => {
    if (!isValidProduct(req.body)) {
        return res.status(400).send('name, material and score are all required.');
    }

    const product = formatProduct(req.body);

    fs.writeFile(PRODUCTS_FILE, product, (err) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.send('Product created successfully!');
    });
});

// APPEND (adds another product to the existing file) ------------------
app.post('/products/append', (req, res) => {
    if (!isValidProduct(req.body)) {
        return res.status(400).send('name, material and score are all required.');
    }

    // If the file doesn't exist yet, appendFile will create it, so this
    // works standalone too, but we add a leading newline only when needed.
    fs.readFile(PRODUCTS_FILE, 'utf-8', (readErr, existing) => {
        const needsNewline = !readErr && existing && !existing.endsWith('\n');
        const product = `${needsNewline ? '\n' : ''}${formatProduct(req.body)}\n`;

        fs.appendFile(PRODUCTS_FILE, product, (err) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.send('Product appended successfully!');
        });
    });
});

// UNLINK (deletes the products file) -----------------------------------
app.delete('/products', (req, res) => {
    fs.unlink(PRODUCTS_FILE, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).send('Nothing to delete — products file does not exist.');
            }
            return res.status(500).send(err.message);
        }
        res.send('Products file deleted successfully!');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
