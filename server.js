const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// =====================
// CONEXIÓN SEGURA MONGO
// =====================
const MONGO_URI = process.env.MONGO_URI || "";

if(MONGO_URI){
    mongoose.connect(MONGO_URI)
    .then(()=> console.log("Mongo conectado"))
    .catch(err => console.log("Error Mongo:", err));
} else {
    console.log("Mongo no configurado (modo seguro)");
}

// =====================
// MODELO
// =====================
let User;

if(mongoose.connection.readyState){
    User = mongoose.model("User", {
        email:String,
        password:String
    });
}

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());
app.use(express.static("public"));

// =====================
// PRODUCTOS
// =====================
let productos = [];

app.get("/api/products", (req,res)=>{
    res.json(productos);
});

app.post("/api/products", (req,res)=>{
    const { name, price } = req.body;

    productos.push({
        _id: Date.now().toString(),
        name,
        price
    });

    res.json({ ok:true });
});

// =====================
// USUARIOS
// =====================
app.post("/api/register", async (req,res)=>{
    try{
        if(!User){
            return res.json({ ok:true }); // modo sin mongo
        }

        const { email, password } = req.body;
        await User.create({ email, password });

        res.json({ ok:true });
    }catch(e){
        res.json({ error:"error" });
    }
});

app.post("/api/login", async (req,res)=>{
    try{
        if(!User){
            return res.json({ token:"user123" }); // modo prueba
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if(user){
            return res.json({ token:"user123" });
        }

        res.json({ error:"login incorrecto" });
    }catch(e){
        res.json({ error:"error" });
    }
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

app.listen(PORT, ()=>{
    console.log("Servidor corriendo en puerto", PORT);
});