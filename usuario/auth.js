function validarRut(rut) {

    
    rut = rut.replace(/\./g, "").trim();

    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1).toUpperCase();
    
    let suma = 0;
    let multiplicador = 2;

   
    for (let i = cuerpo.length - 1; i >= 0; i--) {

        if (cuerpo[i] == "-") {
            continue;
        }
        suma = suma + Number(cuerpo[i]) * multiplicador;
        multiplicador++;
        if (multiplicador > 7) {
            multiplicador = 2;
        }
    }

    let resto = suma % 11;
    let resultado = 11 - resto;
    let dvEsperado;

    if (resultado == 11) {
        dvEsperado = "0";
    } else if (resultado == 10) {
        dvEsperado = "K";
    } else {
        dvEsperado = String(resultado);
    }
    if (dv == dvEsperado) {
        return true;
    } else {
        return false;
    }
}

const formularioRegistro = document.querySelector(".formulario-registro");
if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", function(event) {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const rut = document.getElementById("rut").value;
        const correo = document.getElementById("correo").value;
        const contrasena = document.getElementById("contrasena").value;
        const confirmar = document.getElementById("confirmar-contrasena").value;
        if (!validarRut(rut)) {
            alert("El RUT ingresado no es válido.");
            return;
        }
        if (contrasena !== confirmar) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        const usuario = {
            nombre: nombre,
            apellido: apellido,
            rut: rut,
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