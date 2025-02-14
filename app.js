const btnSortear = document.querySelector("#btnSortear");
const resultado = document.querySelector("#resultado");
const mensajeFin = document.querySelector("#mensajeFin");
const descargaSecreta = document.querySelector("#descargaSecreta");

// Verificar si ya no hay amigos
async function verificarLista() {
    try {
        let res = await fetch("https://amigomuni.onrender.com/verificarLista");
        let data = await res.json();

        if (data.sinAmigos) {
            mensajeFin.style.display = "block";
            btnSortear.disabled = true;
            btnSortear.style.opacity = "0.5";
            sessionStorage.setItem("bloqueoTotal", "true");
        }
    } catch (error) {
        console.error("Error al verificar la lista de amigos:", error);
    }
}

// Sortear un amigo
btnSortear.addEventListener("click", async () => {
    if (sessionStorage.getItem("sorteoRealizado")) {
        alert(`Ya realizaste un sorteo en esta sesión. Tu amigo es ${data.nombre}`);
        return;
    }

    let nombreUsuario = prompt("Ingresa tu nombre:").trim().toLowerCase();
    if (!nombreUsuario) return;

    try {
        let res = await fetch("https://amigomuni.onrender.com/sortear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombreUsuario })
        });

        let data = await res.json();
        resultado.innerHTML = `<p>${data.mensaje ? data.mensaje : `🎉Tu amigo secreto es: ${data.nombre}🎉`}</p>`;

        if (data.finSorteo) {
            mensajeFin.style.display = "block";
            btnSortear.disabled = true;
            btnSortear.style.opacity = "0.5";
            sessionStorage.setItem("bloqueoTotal", "true");
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
            a.download = "bug.txt";
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

    if (sessionStorage.getItem("bloqueoTotal")) {
        mensajeFin.style.display = "block";
        btnSortear.disabled = true;
        btnSortear.style.opacity = "0.5";
    } else if (sessionStorage.getItem("sorteoRealizado")) {
        btnSortear.disabled = true;
        btnSortear.style.opacity = "0.5";
        resultado.innerHTML = `<p>🎉Amigo sorteado: ${sessionStorage.getItem("resultado")}🎉</p>`;
    }
});
