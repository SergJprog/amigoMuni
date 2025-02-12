const btnAgregar = document.querySelector("#btnAgregar");
const btnSortear = document.querySelector("#btnSortear");
const inputAmigo = document.querySelector("#amigo");
const listaAmigos = document.querySelector("#listaAmigos");
const resultado = document.querySelector("#resultado");

// Cargar lista de amigos al iniciar
async function cargarAmigos() {
    let res = await fetch("http://localhost:3000/amigos");
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
    let res = await fetch("http://localhost:3000/resultados");
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

    let res = await fetch("http://localhost:3000/agregar", {
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
    let res = await fetch("http://localhost:3000/sortear", { method: "POST" });
    let data = await res.json();

    let li = document.createElement("li");
    if (data.mensaje) {
        li.textContent = data.mensaje; // Mensaje "Ya no hay amigos para sortear"
    } else {
        li.textContent = `Amigo sorteado: ${data.nombre}`;
    }
    resultado.appendChild(li);

    cargarAmigos(); // Actualiza la lista de amigos
});

// Cargar datos al inicio
cargarAmigos();
cargarResultados();
