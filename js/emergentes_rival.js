document.addEventListener("DOMContentLoaded", () => {
    const modal_rival = document.getElementById("modalImagen_rival");
    const btnAbrir_rival = document.getElementById("botonAbrirModal_rival");
    const spanCerrar_rival = document.querySelector(".cerrar_rival");

    btnAbrir_rival.onclick = function() {
        modal_rival.style.display = "block";
    }

    spanCerrar_rival.onclick = function() {
        modal_rival.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal_rival) {
            modal_rival.style.display = "none";
        }
    }
});