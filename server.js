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

// Verificar si hay amigos en la lista
app.get("/verificarLista", (req, res) => {
    fs.readFile(archivoAmigos, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error leyendo amigos.txt" });

        let amigos = data.split("\n").map(n => n.trim()).filter(n => n);
        res.json({ sinAmigos: amigos.length === 0 });
    });
});

// Sortear un amigo
app.post("/sortear", (req, res) => {
    const { nombreUsuario } = req.body;

    if (!nombreUsuario) return res.status(400).json({ error: "Nombre requerido" });

    fs.readFile(archivoAmigos, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error leyendo amigos.txt" });

        let amigos = data.split("\n").map(n => n.trim()).filter(n => n);

        if (amigos.length === 0) {
            return res.json({ mensaje: "YA NO HAY MÁS AMIGOS EN EL LISTADO", finSorteo: true });
        }

        let indiceAleatorio = Math.floor(Math.random() * amigos.length);
        let amigoSorteado = amigos[indiceAleatorio];

        amigos.splice(indiceAleatorio, 1);
        fs.writeFile(archivoAmigos, amigos.join("\n"), (err) => {
            if (err) console.error("Error al actualizar amigos.txt", err);
        });

        fs.appendFile(archivoResultados, `${amigoSorteado} - ${nombreUsuario.toLowerCase()}\n`, (err) => {
            if (err) console.error("Error guardando el resultado", err);
        });

        res.json({ nombre: amigoSorteado, finSorteo: amigos.length === 0 });
    });
});

// Descargar resultados
app.get("/descargar", (req, res) => {
    res.download(archivoResultados, "resultado.txt", (err) => {
        if (err) return res.status(500).json({ error: "Error al descargar el archivo" });
    });
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
