const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// =====================
// CONEXIÓN MONGO (DESDE ENV)
// =====================
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => console.log("Mongo conectado"))
.catch(err => {
    console.log("Error Mongo:", err);
    process.exit(1); // evita que el server quede roto
});

// =====================
// MODELOS
// =====================
const User = mongoose.model("User", {
    email: String,
    password: String
});

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());
app.use(express.static("public"));

// =====================
// PRODUCTOS
// =====================
let productos = [];

app.get("/api/products", (req, res) => {
    res.json(productos);
});

app.post("/api/products", (req, res) => {
    const { name, price } = req.body;

    const nuevo = {
        _id: Date.now().toString(),
        name,
        price
    };

    productos.push(nuevo);
    res.json({ ok: true });
});

app.delete("/api/products/:id", (req, res) => {
    productos = productos.filter(p => p._id !== req.params.id);
    res.json({ ok: true });
});

// =====================
// USUARIOS (REGISTRO)
// =====================
app.post("/api/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        await User.create({ email, password });

        res.json({ ok: true });
    } catch (error) {
        res.json({ error: "Error creando usuario" });
    }
});

// =====================
// LOGIN
// =====================
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (user) {
            return res.json({ token: "user123" });
        }

        res.json({ error: "login incorrecto" });
    } catch (error) {
        res.json({ error: "error servidor" });
    }
});

// =====================
// ADMIN
// =====================
app.post("/api/admin-login", (req, res) => {
    const { user, pass } = req.body;

    if (user === "admin" && pass === "1234") {
        return res.json({ token: "admin123" });
    }

    res.json({ error: "error" });
});

// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto", PORT);
});