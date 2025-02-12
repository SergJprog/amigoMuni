const btnSortear = document.querySelector("#btnSortear");
const listaAmigos = document.querySelector("#listaAmigos");
const resultado = document.querySelector("#resultado");
const imgDescargar = document.querySelector("#btnDescargar");

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

        // Ocultar la opción de descarga si todavía hay amigos en la lista
        imgDescargar.style.opacity = amigos.length === 0 ? "1" : "0.5";
        imgDescargar.style.pointerEvents = amigos.length === 0 ? "auto" : "none";
        
    } catch (error) {
        console.error("Error al cargar la lista de amigos:", error);
    }
}

// Sortear un amigo
btnSortear.addEventListener("click", async () => {
    try {
        let res = await fetch("https://amigomuni.onrender.com/sortear", { method: "POST" });
        let data = await res.json();

        resultado.innerHTML = "";
        let p = document.createElement("p");
        p.textContent = data.mensaje ? data.mensaje : `Amigo sorteado: ${data.nombre}`;
        resultado.appendChild(p);

        await cargarAmigos(); // Actualizar la lista después de cada sorteo

        // Deshabilitar el botón si ya no hay amigos
        if (listaAmigos.children.length === 0) {
            btnSortear.disabled = true;
            btnSortear.style.opacity = "0.5";
        }
    } catch (error) {
        console.error("Error al sortear:", error);
    }
});

// Descargar los resultados cuando ya no hay amigos en la lista
imgDescargar.addEventListener("click", async () => {
    try {
        let res = await fetch("https://amigomuni.onrender.com/puedeDescargar");
        let { puedeDescargar } = await res.json();

        if (!puedeDescargar) {
            alert("Aún quedan amigos en la lista. Termina el sorteo antes de descargar.");
            return;
        }

        const archivo = await fetch("https://amigomuni.onrender.com/descargar");
        if (archivo.ok) {
            const blob = await archivo.blob();
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

// Verificar si hay amigos al cargar la página
document.addEventListener("DOMContentLoaded", cargarAmigos);
