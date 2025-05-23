document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalImagen");
    const btnAbrir = document.getElementById("botonAbrirModal");
    const spanCerrar = document.querySelector(".cerrar");

    btnAbrir.onclick = function() {
        modal.style.display = "block";
    }

    spanCerrar.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
});