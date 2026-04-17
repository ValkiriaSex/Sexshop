const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// 🔥 CONEXIÓN MONGO (PEGA TU URL)
mongoose.connect("mongodb+srv://yinethbueno2618_db_user:SexShopV1@cluster0.badwtvh.mongodb.net/?appName=Cluster0");

// MODELO
const User = mongoose.model("User", {
    email:String,
    password:String
});

// middleware
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
    res.json({ ok:true });
});

app.delete("/api/products/:id", (req, res) => {
    productos = productos.filter(p => p._id !== req.params.id);
    res.json({ ok:true });
});

// =====================
// USUARIOS (REAL)
// =====================
app.post("/api/register", async (req,res)=>{
    const { email, password } = req.body;

    await User.create({ email, password });

    res.json({ ok:true });
});

app.post("/api/login", async (req,res)=>{
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if(user){
        return res.json({ token:"user123" });
    }

    res.json({ error:"login incorrecto" });
});

// =====================
// ADMIN
// =====================
app.post("/api/admin-login", (req,res)=>{
    const { user, pass } = req.body;

    if(user === "admin" && pass === "1234"){
        return res.json({ token:"admin123" });
    }

    res.json({ error:"error" });
});

// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto", PORT);
});