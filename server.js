const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// 🔥 carpeta uploads
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
// SUBIR PRODUCTO CON IMAGEN
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
app.get("/api/products", (req,res)=>{
    res.json(productos);
});

// =====================
app.post("/api/pedido", (req,res)=>{
    pedidos.push({
        id: Date.now(),
        items: req.body.items,
        total: req.body.total
    });

    res.json({ ok:true });
});

app.get("/api/pedidos", (req,res)=>{
    res.json(pedidos);
});

// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log("Servidor listo"));