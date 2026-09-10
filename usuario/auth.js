const formularioRegistro = document.querySelector(".formulario-registro");

if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", function(event) {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const correo = document.getElementById("correo").value;
        const contrasena = document.getElementById("contrasena").value;
        const confirmar = document.getElementById("confirmar-contrasena").value;
        if (contrasena !== confirmar) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        const usuario = {
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            contrasena: contrasena
        };
        localStorage.setItem("usuario", JSON.stringify(usuario));
        alert("Registro realizado correctamente.");
        window.location.href = "inicio_sesion.html";
    });
}
const formularioLogin = document.querySelector(".formulario-login");
if (formularioLogin) {
    formularioLogin.addEventListener("submit", function(event) {
        
        event.preventDefault();

        const correo = document.getElementById("correo").value;
        const contrasena = document.getElementById("contrasena").value;

        const usuarioGuardado =
            JSON.parse(localStorage.getItem("usuario"));

        if (!usuarioGuardado) {
            alert("No existe ningún usuario registrado.");
            return;
        }
        if (
            correo === usuarioGuardado.correo &&
            contrasena === usuarioGuardado.contrasena
        ) {
            alert("Inicio de sesión correcto.");
            window.location.href = "../inicio/index.html";
        } else {
            alert("Correo o contraseña incorrectos.");
        }
    })
}