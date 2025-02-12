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

// Leer la lista de amigos
app.get("/amigos", (req, res) => {
    fs.readFile(archivoAmigos, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error leyendo amigos.txt" });
        let amigos = data.split("\n").map(n => n.trim()).filter(n => n);
        res.json(amigos);
    });
});

// Leer los resultados anteriores
app.get("/resultados", (req, res) => {
    fs.readFile(archivoResultados, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error leyendo resultado.txt" });
        let sorteos = data.split("\n").map(n => n.trim()).filter(n => n);
        res.json(sorteos);
    });
});

// Agregar un amigo
app.post("/agregar", (req, res) => {
    let { nombre } = req.body;
    if (!nombre || nombre.trim() === "") {
        return res.status(400).json({ error: "Nombre no válido" });
    }

    fs.appendFile(archivoAmigos, `${nombre.trim()}\n`, (err) => {
        if (err) return res.status(500).json({ error: "Error al guardar el amigo" });
        res.status(200).json({ mensaje: "Amigo agregado" });
    });
});

// Sortear un amigo (eliminándolo del archivo)
app.post("/sortear", (req, res) => {
    fs.readFile(archivoAmigos, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error leyendo amigos.txt" });

        let amigos = data.split("\n").map(n => n.trim()).filter(n => n);
        if (amigos.length === 0) {
            return res.json({ mensaje: "Ya no hay amigos para sortear" });
        }

        let indiceAleatorio = Math.floor(Math.random() * amigos.length);
        let amigoSorteado = amigos[indiceAleatorio];

        // Eliminar al amigo sorteado y actualizar el archivo
        amigos.splice(indiceAleatorio, 1);
        fs.writeFile(archivoAmigos, amigos.join("\n"), (err) => {
            if (err) console.error("Error al actualizar amigos.txt", err);
        });

        // Guardar el resultado en resultado.txt
        fs.appendFile(archivoResultados, `${amigoSorteado}\n`, (err) => {
            if (err) console.error("Error guardando el resultado", err);
        });

        res.json({ nombre: amigoSorteado });
    });
});

// Ruta para descargar el archivo de resultados
app.get("/descargar", (req, res) => {
    res.download(archivoResultados, "resultado.txt", (err) => {
        if (err) {
            return res.status(500).json({ error: "Error al descargar el archivo" });
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
