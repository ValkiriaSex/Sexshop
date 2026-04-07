require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// 🔧 Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 🔌 Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.log("❌ Error Mongo:", err.message));

// 🔐 LOGIN SIMPLE
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

// 🔒 Middleware de seguridad
function auth(req, res, next) {
    const token = req.headers["authorization"];

    if (token !== "admin-token") {
        return res.status(401).json({ error: "No autorizado" });
    }

    next();
}

// 📦 MODELOS
const Product = mongoose.model("Product", {
    name: String,
    price: Number
});

const Pedido = mongoose.model("Pedido", {
    carrito: Array,
    total: Number,
    fecha: { type: Date, default: Date.now }
});

// 🔑 LOGIN
app.post("/api/login", (req, res) => {
    const { user, pass } = req.body;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        return res.json({ token: "admin-token" });
    }

    res.status(401).json({ error: "Credenciales incorrectas" });
});

// 🛍️ PRODUCTOS
app.get("/api/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// ➕ AGREGAR PRODUCTO (ADMIN)
app.post("/api/products", auth, async (req, res) => {
    const { name, price } = req.body;

    const nuevo = new Product({
        name,
        price: Number(price)
    });

    await nuevo.save();
    res.json(nuevo);
});

// 🧾 GUARDAR PEDIDO
app.post("/api/pedidos", async (req, res) => {
    const { carrito, total } = req.body;

    const nuevo = new Pedido({ carrito, total });
    await nuevo.save();

    res.json({ ok: true });
});

// 📦 VER PEDIDOS (ADMIN)
app.get("/api/pedidos", auth, async (req, res) => {
    const pedidos = await Pedido.find().sort({ fecha: -1 });
    res.json(pedidos);
});


// 🌍 RUTAS BONITAS (IMPORTANTE)
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public/admin.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public/login.html"));
});

// 🚀 SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor en puerto ${PORT}`);
});