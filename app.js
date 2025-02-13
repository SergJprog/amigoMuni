const btnSortear = document.querySelector("#btnSortear");
const listaAmigos = document.querySelector("#listaAmigos");
const resultado = document.querySelector("#resultado");
const imgDescargar = document.querySelector("#btnDescargar");
const inputNombre = document.querySelector("#nombreParticipante"); // Capturar el input

btnSortear.addEventListener("click", async () => {
    const nombreUsuario = inputNombre.value.trim(); // Obtener el nombre del participante

    if (!nombreUsuario) {
        alert("Por favor, ingresa tu nombre antes de sortear.");
        return;
    }

    if (sessionStorage.getItem("sorteoRealizado")) {
        alert("Ya realizaste un sorteo en esta sesión.");
        return;
    }

    try {
        let res = await fetch("https://amigomuni.onrender.com/sortear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: nombreUsuario }) // Enviar el nombre al servidor
        });

        let data = await res.json();

        resultado.innerHTML = "";
        let p = document.createElement("p");
        p.textContent = data.mensaje ? data.mensaje : `Amigo sorteado: ${data.nombre}`;
        resultado.appendChild(p);

        imgDescargar.style.display = "inline-block";
        btnSortear.disabled = true;
        btnSortear.style.opacity = "0.5";
        sessionStorage.setItem("sorteoRealizado", "true");
    } catch (error) {
        console.error("Error al sortear:", error);
    }
});

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
