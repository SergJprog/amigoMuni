const btnSortear = document.querySelector("#btnSortear");
const resultado = document.querySelector("#resultado");
const mensajeFin = document.querySelector("#mensajeFin");
const nombreInput = document.querySelector("#nombreParticipante");
const descargaSecreta = document.querySelector("#descargaSecreta");

// Verificar si el usuario ya sorteó antes
const usuario = localStorage.getItem("usuario") || "";
const resultadoPrevio = localStorage.getItem("resultadoPrevio") || "";

if (usuario && resultadoPrevio) {
    resultado.innerHTML = `<p>Tu amigo sorteado fue: ${resultadoPrevio}</p>`;
    btnSortear.disabled = true;
}

// Función para verificar si quedan amigos
async function verificarLista() {
    let res = await fetch("https://amigomuni.onrender.com/verificarLista");
    let data = await res.json();
    if (data.sinAmigos) {
        mensajeFin.style.display = "block";
        btnSortear.disabled = true;
    }
}

// Evento para sortear un amigo
btnSortear.addEventListener("click", async () => {
    if (!nombreInput.value.trim()) {
        alert("Por favor, ingresa tu nombre.");
        return;
    }

    const nombreUsuario = nombreInput.value.trim().toLowerCase(); // Ignorar mayúsculas y minúsculas

    let res = await fetch("https://amigomuni.onrender.com/sortear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreUsuario })
    });

    let data = await res.json();
    if (data.error) {
        alert(data.error);
        return;
    }

    resultado.innerHTML = `<p>Tu amigo sorteado fue: ${data.nombre}</p>`;
    btnSortear.disabled = true;
    
    localStorage.setItem("usuario", nombreUsuario);
    localStorage.setItem("resultadoPrevio", data.nombre);

    verificarLista();
});

// Evento para descargar resultados de forma oculta
descargaSecreta.addEventListener("click", async () => {
    let res = await fetch("https://amigomuni.onrender.com/descargar");
    if (res.ok) {
        let blob = await res.blob();
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "resultado.txt";
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
});

// Verificar la lista al cargar la página
document.addEventListener("DOMContentLoaded", verificarLista);
