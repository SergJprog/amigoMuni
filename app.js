const btnSortear = document.querySelector("#btnSortear");
const resultado = document.querySelector("#resultado");
const btnDescargar = document.createElement("button");

btnDescargar.style.position = "absolute";
btnDescargar.style.top = "10px"; 
btnDescargar.style.left = "10px";
btnDescargar.style.opacity = "0";
btnDescargar.style.cursor = "pointer";
btnDescargar.textContent = "Descargar (Oculto)";
document.body.appendChild(btnDescargar);

const mensajeFin = document.querySelector("#mensajeFin");

// Obtener nombre del usuario sin importar mayúsculas/minúsculas
function obtenerNombreUsuario() {
    let nombre = sessionStorage.getItem("nombreUsuario") || prompt("Ingresa tu nombre:");
    if (nombre) {
        nombre = nombre.trim().toLowerCase(); // Convertir a minúsculas
        sessionStorage.setItem("nombreUsuario", nombre);
    }
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

function mostrarFinDelSorteo() {
    // Almacenar en sessionStorage que el sorteo ha finalizado
    sessionStorage.setItem("bloqueoSorteo", "true");

    // Mostrar el mensaje grande de fin del sorteo
    document.body.innerHTML = `
        <div style="text-align: center; font-size: 32px; font-weight: bold; color: red; margin-top: 20vh;">
            🥺 YA NO HAY MÁS AMIGOS EN EL LISTADO 🥺
        </div>
    `;
}

// Modificar la función verificarLista para que solo el siguiente usuario vea el mensaje
async function verificarLista() {
    try {
        let res = await fetch("https://amigomuni.onrender.com/verificarLista");
        let data = await res.json();

        if (!data.quedanAmigos) {
            // Guardar en sessionStorage que ya no hay amigos, pero no mostrar el mensaje aún
            sessionStorage.setItem("listaVacia", "true");
        }

        // Si ya se había registrado que la lista está vacía, mostrar el mensaje
        if (sessionStorage.getItem("listaVacia") === "true") {
            mostrarFinDelSorteo();
        }
    } catch (error) {
        console.error("Error al verificar la lista:", error);
    }
}


btnSortear.addEventListener("click", async () => {
    const nombreUsuario = obtenerNombreUsuario();
    if (!nombreUsuario) return;

    if (sessionStorage.getItem("sorteoRealizado")) {
        alert(`Ya realizaste un sorteo. Tu amigo secreto es: ${data.nombre}`);
        return;
    }

    try {
        let res = await fetch("https://amigomuni.onrender.com/sortear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: nombreUsuario })
        });

        let data = await res.json();
        resultado.innerHTML = `<p>🥳 Tu amigo secreto es: ${data.nombre} - ${nombreUsuario} 🥳</p>`;

        if (data.quedanAmigos === 0) {
            mostrarFinDelSorteo();
        }

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
