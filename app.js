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
    } catch (error) {
        console.error("Error al cargar la lista de amigos:", error);
    }
}

// Sortear un amigo (una sola vez por sesión)
btnSortear.addEventListener("click", async () => {
    if (sessionStorage.getItem("sorteoRealizado")) {
        alert("Ya realizaste un sorteo en esta sesión.");
        return;
    }

    try {
        let res = await fetch("https://amigomuni.onrender.com/sortear", { method: "POST" });
        let data = await res.json();

        resultado.innerHTML = "";
        let p = document.createElement("p");
        p.textContent = data.mensaje ? data.mensaje : `Amigo sorteado: ${data.nombre}`;
        resultado.appendChild(p);

        cargarAmigos(); // Volver a cargar la lista de amigos actualizada

        // Mostrar la imagen de descarga después del sorteo
        imgDescargar.style.display = "inline-block";

        // Deshabilitar el botón después de un sorteo
        btnSortear.disabled = true;
        btnSortear.style.opacity = "0.5";
        sessionStorage.setItem("sorteoRealizado", "true"); // Guardar en sessionStorage
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

// Verificar si el sorteo ya se hizo en la sesión
document.addEventListener("DOMContentLoaded", () => {
    cargarAmigos();
    if (sessionStorage.getItem("sorteoRealizado")) {
        btnSortear.disabled = true;
        btnSortear.style.opacity = "0.5";
    }
});
