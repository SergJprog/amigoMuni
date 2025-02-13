const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const archivoAmigos = path.join(__dirname, "amigos.txt");
const archivoResultados = path.join(__dirname, "resultado.txt");

app.use(cors());
app.use(express.json());

// Verificar si hay resultados para habilitar la descarga
app.get("/verificarResultados", (req, res) => {
    fs.readFile(archivoResultados, "utf8", (err, data) => {
        if (err || !data.trim()) {
            return res.json({ hayResultados: false });
        }
        res.json({ hayResultados: true });
    });
});

app.post("/sortear", (req, res) => {
    const { usuario } = req.body;

    if (!usuario) {
        return res.status(400).json({ error: "Se requiere un nombre para sortear" });
    }

    fs.readFile(archivoAmigos, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error leyendo amigos.txt" });

        let amigos = data.split("\n").map(n => n.trim()).filter(n => n);
        if (amigos.length === 0) {
            return res.json({ mensaje: "Ya no hay amigos para sortear" });
        }

        let indiceAleatorio = Math.floor(Math.random() * amigos.length);
        let amigoSorteado = amigos[indiceAleatorio];

        amigos.splice(indiceAleatorio, 1);
        fs.writeFile(archivoAmigos, amigos.join("\n"), (err) => {
            if (err) console.error("Error al actualizar amigos.txt", err);
        });

        fs.appendFile(archivoResultados, `${amigoSorteado} - ${usuario}\n`, (err) => {
            if (err) console.error("Error guardando el resultado", err);
        });

        res.json({ nombre: amigoSorteado });
    });
});

app.get("/descargar", (req, res) => {
    res.download(archivoResultados, "resultado.txt", (err) => {
        if (err) {
            return res.status(500).json({ error: "Error al descargar el archivo" });
        }
    });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
