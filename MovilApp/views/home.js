MovilApp.home = function (params) {
    "use strict";

    var viewModel = {
        //Vista Principal
        tituloComandoLogin: ko.observable(),
        botonRecompensaVisible: ko.observable(),
        BotonRecompensaClick: function () {
            MostrarAlerta("Toma la recompensa, si cierras sesión te la quito.");
        },

        //LogIn
        AccionComandoLogin: function () {
            if (MovilApp.info_usuario.iu_reg) {
                this.popUpUserInfoVisible(true);
            } else {
                MostrarPopUpLogIn();
            }
        },
        popUpLoginVisible: ko.observable(false),
        campoLogin_email: ko.observable(""),
        campoLogin_contraseña: ko.observable(""),
        valorCheckMuestraPass: ko.observable(false),
        mostrarContrasena: ko.observable('password'),
        AccionCheckMuestraPass: function () { this.valorCheckMuestraPass() ? this.mostrarContrasena('normal') : this.mostrarContrasena('password') },
        BotonIniciarClick: function () {
            //probar
            if (!this.campoLogin_email() || !this.campoLogin_contraseña()) {
                return MostrarAlerta("El email y la contraseña son requeridas");
            }
            firebase.auth().signInWithEmailAndPassword(this.campoLogin_email(), this.campoLogin_contraseña())
                .then(function () {
                    MostrarAlerta("@Aqui debe salir con sesion iniciada");
                    CerrarPopUps();
                })
                .catch(function (error) {
                    var codigoError = error.code;
                    var mensajeError = error.message;
                    MostrarAlerta("Error " + codigoError + ": " + mensajeError);
                });
        },
        BotonRegistrarClick: function () {
            this.popUpRegisterVisible(true);
            this.campoReg_nombre("");
            this.campoReg_email(this.campoLogin_email());
            this.campoReg_contraseña("");
            this.campoReg_contraseña2("");
        },

        //Registrar
        popUpRegisterVisible: ko.observable(false),
        campoReg_nombre: ko.observable(""),
        campoReg_email: ko.observable(""),
        campoReg_contraseña: ko.observable(""),
        campoReg_contraseña2: ko.observable(""),
        BotonCrearClick: function () {
            //probar
            if (ValidarDatos(this.campoReg_nombre(), this.campoReg_email(), this.campoReg_contraseña(), this.campoReg_contraseña2())) {
                firebase.auth().createUserWithEmailAndPassword(this.campoReg_email(), this.campoReg_contraseña())
                .then(function () {
                    //Hacer consulta a BD de PostgreSQL
                    //Agregando un nuevo usuario con id = campoReg_email y nombre = campoReg_nombre
                    //El rol debe ser desde otra parte
                    MostrarAlerta("@Aqui debe salir con sesion iniciada");
                    CerrarPopUps();
                })
                .catch(function (error) {
                    var codigoError = error.code;
                    var mensajeError = error.message;
                    MostrarAlerta("Error " + codigoError + ": " + mensajeError);
                });
            }
        },

        //InfoUsuario
        popUpUserInfoVisible: ko.observable(false),
        campoInfo_nombre: ko.observable(""),
        campoInfo_email: ko.observable(""),
        BotonLogoutClick: function () {
            //probar
            firebase.auth().signOut().then(function () {
                CerrarPopUps();
            }).catch(function (error) {
                var codigoError = error.code;
                var mensajeError = error.message;
                MostrarAlerta("Error " + codigoError + ": " + mensajeError);
            });
        },

        //Cargar al inicio
        viewShown: MostrarAlInicio
    };

    function MostrarAlInicio() {
        this.tituloComandoLogin(MovilApp.info_usuario.iu_nombre);
        this.botonRecompensaVisible(MovilApp.info_usuario.iu_reg);

        if (MovilApp.info_usuario.iu_reg) {
            this.campoInfo_nombre(MovilApp.info_usuario.iu_nombre);
            this.campoInfo_email(MovilApp.info_usuario.iu_email);
        } else {
            var result = DevExpress.ui.dialog.confirm("Actualmente es un usuario Anónimo. ¿Desea continuar así?", "Aviso");
            result.done(function (dialogResult) {
                //console.log(dialogResult);
                if (!dialogResult) {
                    MostrarPopUpLogIn();
                }
            });
        }
    };

    function MostrarPopUpLogIn() {
        viewModel.popUpLoginVisible(true);
        viewModel.campoLogin_email("");
        viewModel.campoLogin_contraseña("");
    };

    function MostrarAlerta(mensaje) {
        DevExpress.ui.dialog.alert(mensaje);
    }

    function ValidarDatos(nombre, correo, clave1, clave2) {
        if (!nombre) {
            MostrarAlerta("El nombre es requerido.");
            return false;
        }
        if (!correo) {
            MostrarAlerta("El e-mail es requerido.");
            return false;
        }
        if (!clave1) {
            MostrarAlerta("La contraseña es requerida.");
            return false;
        }
        if (clave1 != clave2) {
            MostrarAlerta("Las contraseñas no coinciden.");
            return false;
        }
        return true;
    }

    function CerrarPopUps() {
        viewModel.popUpLoginVisible(false);
        viewModel.popUpRegisterVisible(false);
        viewModel.popUpUserInfoVisible(false);
    }

    return viewModel;
};