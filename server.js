import express from "express";
import path from "path";

const app = express();

// middleware
app.use(express.json());
app.use(express.static("public"));

// =====================
// BASE DE DATOS TEMPORAL
// =====================
let usuarios = [];
let productos = [];

// =====================
// RUTA PRINCIPAL
// =====================
app.get("/", (req, res) => {
    res.sendFile(path.resolve("public/index.html"));
});

// =====================
// PRODUCTOS
// =====================
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
    const id = req.params.id;

    productos = productos.filter(p => p._id !== id);

    res.json({ ok: true });
});

// =====================
// USUARIOS
// =====================
app.post("/api/register", (req, res) => {
    const { email, password } = req.body;

    usuarios.push({ email, password });

    res.json({ ok: true });
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    const user = usuarios.find(u => u.email === email && u.password === password);

    if (user) {
        return res.json({ token: "user123" });
    }

    res.json({ error: "login incorrecto" });
});

// =====================
// ADMIN LOGIN
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