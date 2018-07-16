MovilApp.home = function (params) {
    "use strict";
    //const pEmail = document.getElementById('pEmail');
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
        buttonAnonymousAction: buttonAnonymouslyHandler,

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
        tbInfoEmailVisible: ko.observable(false),
        tbInfoEmailValue: ko.observable(""),
        buttonLogoutAction: buttonLogoutHandler,

        //Cargar al inicio
        viewShown: viewShowHandler
    };

    function viewShowHandler() {
        commandLoginTitleHandler();
        this.buttonRewardVisible(false);
        //ShowAlert("Usuario: " + firebase.auth().currentUser);
        if (firebase.auth().currentUser != null) {
            this.tbInfoEmailVisible(true);
            //pEmail.classList.remove('hide');
            if (firebase.auth().currentUser.email != null) {
                this.tbInfoNameValue((firebase.auth().currentUser.email).toString().split('@', 1));//este es el nombre, de momento
                this.tbInfoEmailValue(firebase.auth().currentUser.email);
                this.buttonRewardVisible(true);
            } else if (firebase.auth().currentUser.isAnonymous) {
                this.tbInfoNameValue("Anonymous");
                this.tbInfoEmailVisible(false);
                //pEmail.classList.add('hide');
            } else {
                this.tbInfoNameValue("Indefined");
                this.tbInfoEmailVisible(false);
            }

        } else {
            var result = DevExpress.ui.dialog.confirm("You are not loged in. Would you like to continue that way?", "Warning");
            result.done(function (dialogResult) {
                //console.log(dialogResult);
                if (!dialogResult) {
                    ShowPopUpLogin();
                }
            });
        }
    };

    function commandLoginTitleHandler() {
        if (firebase.auth().currentUser != null) {
            viewModel.commandLoginTitle("Loged in");
        } else {
            viewModel.commandLoginTitle("Loged out");
        }
    }

    function buttonRewardHandler() {
        ShowAlert("Obtained reward, now logout.");
    }

    function commandLoginHandler() {
        if (firebase.auth().currentUser != null) {
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

    function buttonAnonymouslyHandler() {
        firebase.auth().signInAnonymously()
            .then(function () {
                //SignIn anonimo
                CloseAllPopUps();
            })
            .catch(function (error) {
                var codigoError = error.code;
                var mensajeError = error.message;
                ShowAlert("Error " + codigoError + ": " + mensajeError);
            });
    }

    function buttonCreateHandler() {
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
        commandLoginTitleHandler();
    };

    return viewModel;
};