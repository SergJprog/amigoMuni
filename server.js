app.post("/sortear", (req, res) => {
    const { usuario } = req.body; // Capturar el nombre del usuario

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

        // Guardar en el archivo de resultados el amigo sorteado y el usuario que sorteó
        fs.appendFile(archivoResultados, `${amigoSorteado} - ${usuario}\n`, (err) => {
            if (err) console.error("Error guardando el resultado", err);
        });

        res.json({ nombre: amigoSorteado });
    });
});

// Permitir descargar el archivo de resultados en cualquier momento
app.get("/descargar", (req, res) => {
    res.download(archivoResultados, "resultado.txt", (err) => {
        if (err) {
            return res.status(500).json({ error: "Error al descargar el archivo" });
        }
    });
});
