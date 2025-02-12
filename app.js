const btnAgregar = document.querySelector("#btnAgregar");
const btnSortear = document.querySelector("#btnSortear");
const inputAmigo = document.querySelector("#amigo");
const listaAmigos = document.querySelector("#listaAmigos");
const resultado = document.querySelector("#resultado");
const imgDescargar = document.querySelector("#btnDescargar"); // Imagen existente

// Cargar lista de amigos al iniciar
async function cargarAmigos() {
    let res = await fetch("https://amigomuni.onrender.com/amigos");
    let amigos = await res.json();
    listaAmigos.innerHTML = "";
    amigos.forEach(amigo => {
        let li = document.createElement("li");
        li.textContent = amigo;
        listaAmigos.appendChild(li);
    });
}

// Agregar un amigo
btnAgregar.addEventListener("click", async () => {
    let nombre = inputAmigo.value.trim();
    if (nombre === "") {
        alert("Ingrese un nombre válido.");
        return;
    }

    let res = await fetch("https://amigomuni.onrender.com/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre })
    });

    if (res.ok) {
        inputAmigo.value = "";
        cargarAmigos();
    }
});

// Sortear un amigo
btnSortear.addEventListener("click", async () => {
    let res = await fetch("https://amigomuni.onrender.com/sortear", { method: "POST" });
    let data = await res.json();

    // Limpiar resultado previo y mostrar solo el nuevo
    resultado.innerHTML = "";

    let p = document.createElement("p");
    p.textContent = data.mensaje ? data.mensaje : `Amigo sorteado: ${data.nombre}`;
    resultado.appendChild(p);

    cargarAmigos(); // Actualiza la lista de amigos

    // Mostrar la imagen de descarga después del sorteo
    imgDescargar.style.display = "inline-block"; // Se muestra la imagen como botón
});

// Descargar los resultados
imgDescargar.addEventListener("click", async () => {
    const res = await fetch("https://amigomuni.onrender.com/descargar");
    if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resultado.txt";
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
});

// Cargar datos al inicio
cargarAmigos();
