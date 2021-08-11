//------------------VARIABLES---------------------------------------------//

const storageData = [];
const data = [];

const ambientes = ["baño", "cocina", "dormitorio", "comedor", "living"];
const URLGET = "https://www.dolarsi.com/api/api.php?type=valoresprincipales";
const COEFM2 = 72000;

const provincias = [
  "Buenos Aires",
  "",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Cordoba",
  "Corrientes",
  "Entre Rios",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "Mendoza",
  "Misiones",
  "Neuquen",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Rio Negro",
  "Tierra del Fuego",
  "Tucuman",
];

let nombreUsuario;
let apellidoUsuario;
let mailUsuario;
let telefonoUsuario;
let ciudadUsuario;
let provinciaUsuario;

var mailExpr = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;

const inputProvincia = document.getElementById("inputProvincia");

//----------------------------------------------------------------//

$(function () {
  //--------------Funciones scroll navbar y slider-----------------/
  $(window).scroll(() => {
    $("nav").toggleClass("scrolled", $(this).scrollTop() > 50);
  });

  $("#slideshow > div:gt(0)").hide();

  setInterval(function () {
    $("#slideshow > div:first")
      .fadeOut(2000)
      .next()
      .fadeIn(2000)
      .end()
      .appendTo("#slideshow");
  }, 5000);
});

//---------------------------------------------------------------//
class Usuario {
  constructor(obj) {
    this.nombre = obj.nombre;
    this.apellido = obj.apellido;
    this.mail = obj.mail;
    this.telefono = obj.telefono;
    this.ciudad = obj.ciudad;
    this.provincia = obj.provincia;
  }
  registro() {
    let bienvenido = `Bienvenido ${this.nombre} ${this.apellido}, te has registrado con exito.`;
    return bienvenido;
  }
}

//-------------------FUNCIONES------------------------------//

let validacion = () => {
  nombreUsuario = $("#inputName").val();
  if (nombreUsuario === "") {
    $("#inputName").css({
      "border-color": "#F54047",
    });
    $("div#nombre span.error").fadeIn(2000).css("color", "#F54047");
    return false;
  } else {
    $("#inputName.error").hide();
    $("#inputName").css({
      "border-color": "",
    });
  }
  apellidoUsuario = $("#inputSurName").val();

  mailUsuario = $("#inputEmail").val();

  if (mailUsuario === "") {
    $("#inputEmail").css({
      "border-color": "#F54047",
    });
    $("div#mail span.error").fadeIn(2000).css("color", "#F54047");
    return false;
  } else if (!mailExpr.test(mailUsuario)) {
    $("div#mail span.error").hide();
    $("#mail")
      .append('<span id="error3" >El mail ingresado es invalido</span>')
      .fadeIn(2000);
    $("#mail span#error3").css("color", "#F54047");
    $("#inputEmail").css({
      "border-color": "#F54047",
    });
    return false;
  } else {}

  telefonoUsuario = $("#inputPhone").val();
  ciudadUsuario = $("#inputCity").val();
  provinciaUsuario = $("#inputProvincia").val();

  let user = {
    nombre: nombreUsuario,
    apellido: apellidoUsuario,
    mail: mailUsuario,
    telefono: telefonoUsuario,
    ciudad: ciudadUsuario,
    provincia: provinciaUsuario,
  };

  data.push(new Usuario(user));
  console.log(data);
  let json = JSON.stringify(data);
  localStorage.setItem("datosJson", json);

  let obj = JSON.parse(localStorage.getItem("datosJson"));
  for (const us of obj) {
    storageData.push(new Usuario(us));
    $(".h4").html(storageData[0].registro());
  }
  $(".oscurecer, #modal").addClass("activo");

  $("#borrar,.oscurecer").on("click", function () {
    $(".oscurecer, #modal").removeClass("activo");
  });
};

function usuarioRegistrado(e) {
  e.preventDefault();
  validacion();
}

//-----------------------------------------------------------------------
$(function () {
  //----------------modal y registro de usuario -------------------//
  $(".error").hide();
  $("#mi-formulario").on("submit", usuarioRegistrado);

  $("#inputName").change(() => {
    $(".error").fadeOut();
    $("#inputName").css({
      "border-color": "",
    });
  });
  $("#inputEmail").change(() => {
    $("div#mail span.error").fadeOut();
    $("div#mail span#error3").hide();
    $("#inputEmail").css({
      "border-color": "",
    });
  });

  $.each(provincias, function (i, element) {
    $("<option/>", {
      text: element,
    }).appendTo("#inputProvincia");
  });

  $("#borrar,.oscurecer").on("click", function () {
    $("#modal").removeClass("activo");
    $("#ambientes").addClass("activo");
  });

  $("#modal2").on("click", function () {
    $("#modal2").removeClass("activo");
  });

  //---------------evento, modal2 y ajax -----------------//
  $("#ambientes.activo, #boton_ambiente").on("click", function (e) {
    e.preventDefault();
    let ambienteUsuario = $("input:radio[name=ambiente]:checked").val();

    let ancho = $("#inputWidth").val();

    let largo = $("#inputLarge").val();

    let dimensiones = parseFloat(ancho * largo);
    let dimensionesEnPesos = dimensiones * COEFM2;

    $.get(URLGET, function (datos) {
      let losDatos = datos;
      console.log(losDatos);

      for (dato of losDatos) {
        //DOLAR BLUE
        if (dato.casa.nombre === "Dolar Blue") {
          let cotizacionEnDolares = (
            dimensionesEnPesos / parseFloat(dato.casa.venta)
          ).toFixed(2);

          $(".h5")
            .html(`${nombreUsuario}, tu cotizacion es de U$D ${cotizacionEnDolares} para tu ${ambienteUsuario}.
         Te estaremos enviando mas detalles al mail.La cotizacion del dolar utilizada es de ${dato.casa.nombre} a $${dato.casa.venta}`);

          $(".oscurecer, #modal2").addClass("activo");
        } else {
          console.log("....");
        }
      }
    });
  });
});