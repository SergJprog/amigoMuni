const btnSortear = document.querySelector("#btnSortear");
const resultado = document.querySelector("#resultado");
const mensajeFin = document.querySelector("#mensajeFin");
const descargaSecreta = document.querySelector("#descargaSecreta");

async function verificarLista() {
    try {
        let res = await fetch("https://amigomuni.onrender.com/verificarLista");
        let data = await res.json();
        
        if (data.sinAmigos) {
            mensajeFin.style.display = "block";
            btnSortear.disabled = true;
        }
    } catch (error) {
        console.error("Error al verificar la lista de amigos:", error);
    }
}

// Sortear un amigo
btnSortear.addEventListener("click", async () => {
    if (sessionStorage.getItem("sorteoRealizado")) {
        alert("Ya realizaste un sorteo en esta sesión.");
        return;
    }

    let nombreUsuario = prompt("Ingresa tu nombre:");
    if (!nombreUsuario) return;

    nombreUsuario = nombreUsuario.trim().toLowerCase(); // Ignorar mayúsculas/minúsculas

    try {
        let res = await fetch("https://amigomuni.onrender.com/sortear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombreUsuario })
        });

        let data = await res.json();
        resultado.innerHTML = `<p>${data.mensaje ? data.mensaje : `Amigo sorteado: ${data.nombre}`}</p>`;

        if (data.finSorteo) {
            mensajeFin.style.display = "block";
            btnSortear.disabled = true;
        }

        sessionStorage.setItem("sorteoRealizado", "true");
        sessionStorage.setItem("resultado", data.nombre);
    } catch (error) {
        console.error("Error al sortear:", error);
    }
});

// Descarga secreta del archivo de resultados
descargaSecreta.addEventListener("click", async () => {
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

// Verificar estado al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
    verificarLista();

    if (sessionStorage.getItem("sorteoRealizado")) {
        btnSortear.disabled = true;
        resultado.innerHTML = `<p>Amigo sorteado: ${sessionStorage.getItem("resultado")}</p>`;
    }
});
