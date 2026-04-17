const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// =====================
// CONFIGURAR SUBIDA DE IMÁGENES
// =====================
const storage = multer.diskStorage({
    destination: "public/uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// =====================
let productos = [];
let pedidos = [];

// =====================
// AGREGAR PRODUCTO CON IMAGEN
// =====================
app.post("/api/products", upload.single("image"), (req, res) => {
    const { name, price, description } = req.body;

    const image = "/uploads/" + req.file.filename;

    productos.push({
        id: Date.now(),
        name,
        price,
        description,
        image
    });

    res.json({ ok: true });
});

// =====================
app.get("/api/products", (req, res) => {
    res.json(productos);
});

// =====================
// PEDIDOS
// =====================
app.post("/api/pedido", (req, res) => {
    pedidos.push({
        id: Date.now(),
        items: req.body.items,
        total: req.body.total
    });

    res.json({ ok: true });
});

app.get("/api/pedidos", (req, res) => {
    res.json(pedidos);
});

// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor listo"));
// ELIMINAR
app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    productos = productos.filter(p => p.id !== id);
    res.json({ ok: true });
});

// EDITAR
app.put("/api/products/:id", upload.single("image"), (req, res) => {
    const id = Number(req.params.id);

    const p = productos.find(x => x.id === id);
    if(!p) return res.json({ error: true });

    p.name = req.body.name;
    p.price = req.body.price;
    p.description = req.body.description;

    if(req.file){
        p.image = "/uploads/" + req.file.filename;
    }

    res.json({ ok:true });
});