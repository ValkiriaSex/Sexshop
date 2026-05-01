const express = require("express");
const multer = require("multer");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// ===== DATOS =====
let usuarios = [];
let productos = [];

// =====================
// REGISTRO
// =====================
app.post("/api/register", (req, res) => {

    console.log("REGISTER HIT");

    const { email, password } = req.body;

    if(!email || !password){
        return res.json({ ok:false });
    }

    const existe = usuarios.find(u => u.email === email);

    if(existe){
        return res.json({ ok:false });
    }

    usuarios.push({ email, password });

    res.json({ ok:true });
});

// =====================
// LOGIN
// =====================
app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    const user = usuarios.find(
        u => u.email === email && u.password === password
    );

    if(user){
        return res.json({ ok:true });
    }

    res.json({ ok:false });
});

// =====================
app.get("/api/products", (req,res)=>{
    res.json(productos);
});

// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor listo"));