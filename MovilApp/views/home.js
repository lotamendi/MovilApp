MovilApp.home = function (params) {
    "use strict";

    var viewModel = {
        //Vista Principal
        commandLoginTitle: ko.observable(),
        buttonRewardVisible: ko.observable(),
        buttonRewardAction: buttonRewardHandler,

        //LogIn
        commandLoginAction: commandLoginHandler,
        popUpLoginVisible: ko.observable(false),
        tbLoginEmailValue: ko.observable(""),
        tbLoginPassValue: ko.observable(""),
        checkShowPassValue: ko.observable(false),
        tbLoginPassMode: ko.observable('password'),
        checkShowPassAction: checkShowPassHandler,
        buttonStartAction: buttonStartHandler,
        buttonRegisterAction: buttonRegisterHandler,

        //Registrar
        popUpRegisterVisible: ko.observable(false),
        tbRegNameValue: ko.observable(""),
        tbRegEmailValue: ko.observable(""),
        tbRegPassValue: ko.observable(""),
        tbRegPassValue2: ko.observable(""),
        buttonCreateAction: buttonCreateHandler,

        //InfoUsuario
        popUpUserInfoVisible: ko.observable(false),
        tbInfoNameValue: ko.observable(""),
        tbInfoEmailValue: ko.observable(""),
        buttonLogoutAction: buttonLogoutHandler,

        //Cargar al inicio
        viewShown: viewShowHandler
    };

    function viewShowHandler() {
        this.commandLoginTitle(MovilApp.infoUser.iuFullName);
        this.buttonRewardVisible(MovilApp.infoUser.iuRegister);

        if (MovilApp.infoUser.iuRegister) {
            this.tbInfoNameValue(MovilApp.infoUser.iuFullName);
            this.tbInfoEmailValue(MovilApp.infoUser.iuEmail);
        } else {
            var result = DevExpress.ui.dialog.confirm("Now you are Anonymous. ¿Would you like to continue that way?", "Warning");
            result.done(function (dialogResult) {
                //console.log(dialogResult);
                if (!dialogResult) {
                    ShowPopUpLogin();
                }
            });
        }
    };

    function buttonRewardHandler() {
        ShowAlert("Obtained reward, now logout.");
    }

    function commandLoginHandler() {
        if (MovilApp.infoUser.iuRegister) {
            this.popUpUserInfoVisible(true);
        } else {
            ShowPopUpLogin();
        }
    }

    function checkShowPassHandler() {
        this.checkShowPassValue() ? this.tbLoginPassMode('normal') : this.tbLoginPassMode('password')
    }

    function buttonStartHandler() {
        //probar
        if (!this.tbLoginEmailValue() || !this.tbLoginPassValue()) {
            return ShowAlert("Email and password are required");
        }
        firebase.auth().signInWithEmailAndPassword(this.tbLoginEmailValue(), this.tbLoginPassValue())
            .then(function () {
                ShowAlert("@Aqui debe salir con sesion iniciada");
                CloseAllPopUps();
            })
            .catch(function (error) {
                var codigoError = error.code;
                var mensajeError = error.message;
                ShowAlert("Error " + codigoError + ": " + mensajeError);
            });
    }

    function buttonRegisterHandler() {
        this.popUpRegisterVisible(true);
        this.tbRegNameValue("");
        this.tbRegEmailValue(this.tbLoginEmailValue());
        this.tbRegPassValue("");
        this.tbRegPassValue2("");
    }

    function buttonCreateHandler() {
        //probar
        if (ValidarDatos(this.tbRegNameValue(), this.tbRegEmailValue(), this.tbRegPassValue(), this.tbRegPassValue2())) {
            firebase.auth().createUserWithEmailAndPassword(this.tbRegEmailValue(), this.tbRegPassValue())
            .then(function () {
                //Hacer consulta a BD de PostgreSQL
                //Agregando un nuevo usuario con id = tbRegEmailValue y nombre = tbRegNameValue
                //El rol debe ser desde otra parte
                ShowAlert("@Aqui debe salir con sesion iniciada");
                CloseAllPopUps();
            })
            .catch(function (error) {
                var codigoError = error.code;
                var mensajeError = error.message;
                ShowAlert("Error " + codigoError + ": " + mensajeError);
            });
        }
    }

    function buttonLogoutHandler() {
        //probar
        firebase.auth().signOut().then(function () {
            CloseAllPopUps();
        }).catch(function (error) {
            var codigoError = error.code;
            var mensajeError = error.message;
            ShowAlert("Error " + codigoError + ": " + mensajeError);
        });
    }

    function ShowPopUpLogin() {
        viewModel.popUpLoginVisible(true);
        viewModel.tbLoginEmailValue("");
        viewModel.tbLoginPassValue("");
    };

    function ShowAlert(mensaje) {
        DevExpress.ui.dialog.alert(mensaje);
    };

    function ValidarDatos(nombre, correo, clave1, clave2) {
        if (!nombre) {
            ShowAlert("The name is required.");
            return false;
        }
        if (!correo) {
            ShowAlert("The e-mail is required.");
            return false;
        }
        if (!clave1) {
            ShowAlert("The password is required.");
            return false;
        }
        if (clave1 != clave2) {
            ShowAlert("The passwords not match.");
            return false;
        }
        return true;
    };

    function CloseAllPopUps() {
        viewModel.popUpLoginVisible(false);
        viewModel.popUpRegisterVisible(false);
        viewModel.popUpUserInfoVisible(false);
        viewModel.commandLoginTitle(MovilApp.infoUser.iuFullName);
    };

    return viewModel;
};