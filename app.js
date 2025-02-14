const btnSortear = document.querySelector("#btnSortear");
const resultado = document.querySelector("#resultado");
const mensajeFin = document.querySelector("#mensajeFin");
const btnDescargar = document.createElement("button");

btnDescargar.style.position = "absolute";
btnDescargar.style.top = "10px"; 
btnDescargar.style.left = "10px";
btnDescargar.style.opacity = "0";
btnDescargar.style.cursor = "pointer";
btnDescargar.textContent = "Descargar (Oculto)";
document.body.appendChild(btnDescargar);

function obtenerNombreUsuario() {
    let nombre = sessionStorage.getItem("nombreUsuario") || prompt("Ingresa tu nombre:");
    if (!nombre) return null;
    nombre = nombre.trim().toLowerCase(); // Convertimos a minúsculas
    sessionStorage.setItem("nombreUsuario", nombre);
    return nombre;
}

// Verificar estado al cargar
document.addEventListener("DOMContentLoaded", async () => {
    const nombreUsuario = obtenerNombreUsuario();
    if (!nombreUsuario) return;

    const yaSorteo = await verificarResultadoUsuario(nombreUsuario);
    if (!yaSorteo) {
        await verificarLista();
    }
});

async function verificarResultadoUsuario(nombreUsuario) {
    try {
        let res = await fetch(`https://amigomuni.onrender.com/verificarResultado/${nombreUsuario}`);
        let data = await res.json();

        if (data.yaSorteo) {
            resultado.innerHTML = `<p>${data.resultado}</p>`;
            btnSortear.disabled = true;
            btnSortear.style.opacity = "0.5";
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error al verificar resultado:", error);
        return false;
    }
}

async function verificarLista() {
    try {
        let res = await fetch("https://amigomuni.onrender.com/verificarLista");
        let data = await res.json();

        if (data.quedanAmigos === "YA_NO_HAY_AMIGOS") {
            mostrarFinDelSorteo();
        }
    } catch (error) {
        console.error("Error al verificar la lista:", error);
    }
}

function mostrarFinDelSorteo() {
    mensajeFin.style.display = "block";
    btnSortear.disabled = true;
    btnSortear.style.opacity = "0.5";
    sessionStorage.setItem("bloqueoSorteo", "true");
}

btnSortear.addEventListener("click", async () => {
    const nombreUsuario = obtenerNombreUsuario();
    if (!nombreUsuario) return;

    if (sessionStorage.getItem("sorteoRealizado")) {
        alert("Ya realizaste un sorteo.");
        return;
    }

    try {
        let res = await fetch("https://amigomuni.onrender.com/sortear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: nombreUsuario })
        });

        let data = await res.json();

        if (data.mensaje === "YA_NO_HAY_AMIGOS") {
            mostrarFinDelSorteo();
            return;
        }

        resultado.innerHTML = `<p>Amigo sorteado: ${data.nombre} - ${nombreUsuario}</p>`;

        verificarLista();
        btnSortear.disabled = true;
        btnSortear.style.opacity = "0.5";
        sessionStorage.setItem("sorteoRealizado", "true");
    } catch (error) {
        console.error("Error al sortear:", error);
    }
});

// Descargar oculto
btnDescargar.addEventListener("click", async () => {
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
        console.error("Error al descargar resultados:", error);
    }
});
