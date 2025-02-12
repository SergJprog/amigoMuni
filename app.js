const btnSortear = document.querySelector("#btnSortear");
const listaAmigos = document.querySelector("#listaAmigos");
const resultado = document.querySelector("#resultado");
const imgDescargar = document.querySelector("#btnDescargar"); // Imagen existente

// Cargar lista de amigos al iniciar
async function cargarAmigos() {
    try {
        let res = await fetch("https://amigomuni.onrender.com/amigos");
        let amigos = await res.json();
        listaAmigos.innerHTML = "";
        amigos.forEach(amigo => {
            let li = document.createElement("li");
            li.textContent = amigo;
            listaAmigos.appendChild(li);
        });
    } catch (error) {
        console.error("Error al cargar la lista de amigos:", error);
    }
}

// Sortear un amigo
btnSortear.addEventListener("click", async () => {
    try {
        let res = await fetch("https://amigomuni.onrender.com/sortear", { method: "POST" });
        let data = await res.json();

        // Limpiar resultado previo y mostrar solo el nuevo
        resultado.innerHTML = "";

        let p = document.createElement("p");
        p.textContent = data.mensaje ? data.mensaje : `Amigo sorteado: ${data.nombre}`;
        resultado.appendChild(p);

        cargarAmigos(); // Volver a cargar la lista de amigos actualizada

        // Mostrar la imagen de descarga después del sorteo
        imgDescargar.style.display = "inline-block"; // Se muestra la imagen como botón
    } catch (error) {
        console.error("Error al sortear:", error);
    }
});

// Descargar los resultados
imgDescargar.addEventListener("click", async () => {
    try {
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
    } catch (error) {
        console.error("Error al descargar los resultados:", error);
    }
});

// Cargar la lista de amigos al inicio
document.addEventListener("DOMContentLoaded", cargarAmigos);
