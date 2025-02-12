const btnAgregar = document.querySelector("#btnAgregar");
const btnSortear = document.querySelector("#btnSortear");
const inputAmigo = document.querySelector("#amigo");
const listaAmigos = document.querySelector("#listaAmigos");
const resultado = document.querySelector("#resultado");
const btnDescargar = document.createElement("button");

// Crear el botón de descarga, pero que inicialmente estará oculto
btnDescargar.id = "btnDescargar";
btnDescargar.textContent = "Descargar resultados";
btnDescargar.style.display = "none";  // Ocultarlo inicialmente
document.body.appendChild(btnDescargar);

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

// Cargar resultados anteriores al iniciar
async function cargarResultados() {
    let res = await fetch("https://amigomuni.onrender.com/resultados");
    let sorteos = await res.json();
    resultado.innerHTML = "";
    sorteos.forEach(nombre => {
        let li = document.createElement("li");
        li.textContent = `Amigo sorteado: ${nombre}`;
        resultado.appendChild(li);
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

    let li = document.createElement("li");
    if (data.mensaje) {
        li.textContent = data.mensaje; // Mensaje "Ya no hay amigos para sortear"
    } else {
        li.textContent = `Amigo sorteado: ${data.nombre}`;
    }
    resultado.appendChild(li);

    cargarAmigos(); // Actualiza la lista de amigos

    // Mostrar el botón de descarga cuando se haya realizado el sorteo
    btnDescargar.style.display = "inline-block";
});

// Descargar los resultados
btnDescargar.addEventListener("click", async () => {
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
cargarResultados();
