require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 🔌 Mongo
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.log("❌ ERROR:", err.message));

// 🔐 ADMIN (puedes cambiarlo luego)
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

// 🔐 Middleware simple de protección
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
    console.log("LOGIN RECIBIDO:", req.body); // 👈 IMPORTANTE

    const { user, pass } = req.body;

    if (user === "admin" && pass === "1234") {
        return res.json({ token: "admin-token" });
    }

    res.status(401).json({ error: "Credenciales incorrectas" });
});

// 🔹 PRODUCTOS (público ver)
app.get("/api/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// 🔹 AGREGAR PRODUCTO (solo admin)
app.post("/api/products", auth, async (req, res) => {
    const { name, price } = req.body;

    const nuevo = new Product({ name, price });
    await nuevo.save();

    res.json(nuevo);
});

// 🔹 GUARDAR PEDIDO (público)
app.post("/api/pedidos", async (req, res) => {
    const { carrito, total } = req.body;

    const nuevoPedido = new Pedido({ carrito, total });
    await nuevoPedido.save();

    res.json({ ok: true });
});

// 🔹 VER PEDIDOS (solo admin)
app.get("/api/pedidos", auth, async (req, res) => {
    const pedidos = await Pedido.find().sort({ fecha: -1 });
    res.json(pedidos);
});

// 🚀 SERVER
app.listen(3000, () => {
    console.log("🚀 http://localhost:3000");
});