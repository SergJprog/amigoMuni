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

// Verificar si ya no hay amigos (se mostrará el mensaje solo tras el último sorteo)
app.get("/verificarLista", (req, res) => {
    fs.readFile(archivoAmigos, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error leyendo amigos.txt" });
        let amigos = data.split("\n").map(n => n.trim()).filter(n => n);
        res.json({ quedanAmigos: amigos.length > 0 ? true : "YA_NO_HAY_AMIGOS" });
    });
});

// Verificar si un usuario ya sorteó (ignorando mayúsculas y minúsculas)
app.get("/verificarResultado/:usuario", (req, res) => {
    const usuario = req.params.usuario.trim().toLowerCase(); // Convertimos a minúsculas

    fs.readFile(archivoResultados, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error leyendo resultado.txt" });

        let lineas = data.split("\n").map(n => n.trim()).filter(n => n);
        let resultadoUsuario = lineas.find(linea => linea.toLowerCase().includes(`- ${usuario}`));

        if (resultadoUsuario) {
            res.json({ yaSorteo: true, resultado: resultadoUsuario });
        } else {
            res.json({ yaSorteo: false });
        }
    });
});

// Sortear un amigo
app.post("/sortear", (req, res) => {
    const usuario = req.body.usuario.trim().toLowerCase(); // Convertimos a minúsculas

    fs.readFile(archivoAmigos, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error leyendo amigos.txt" });

        let amigos = data.split("\n").map(n => n.trim()).filter(n => n);
        if (amigos.length === 0) {
            return res.json({ mensaje: "YA_NO_HAY_AMIGOS" });
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

// Descargar resultados en todo momento
app.get("/descargar", (req, res) => {
    res.download(archivoResultados, "resultado.txt", (err) => {
        if (err) {
            return res.status(500).json({ error: "Error al descargar el archivo" });
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
