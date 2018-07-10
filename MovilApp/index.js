window.MovilApp = window.MovilApp || {};

$(function() {
    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });
    // To customize the Generic theme, use the DevExtreme Theme Builder (http://js.devexpress.com/ThemeBuilder)
    // For details on how to use themes and the Theme Builder, refer to the http://js.devexpress.com/Documentation/Guide/#themes article

    $(document).on("deviceready", function () {
        navigator.splashscreen.hide();
        $(document).on("backbutton", function () {
            DevExpress.processHardwareBackButton();
        });
    });

    function onNavigatingBack(e) {
        if (e.isHardwareButton && !MovilApp.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
    }

    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "android":
                navigator.app.exitApp();
                break;
            case "win":
                MSApp.terminateApp('');
                break;
        }
    }

    MovilApp.app = new DevExpress.framework.html.HtmlApplication({
        namespace: MovilApp,
        layoutSet: DevExpress.framework.html.layoutSets[MovilApp.config.layoutSet],
        navigation: MovilApp.config.navigation,
        commandMapping: MovilApp.config.commandMapping
    });

    firebase.auth().onAuthStateChanged(function (user) {
        //Aqui obtiene el usuario, que puede estar registrado con email
        //o puede ser anonymous

        //Aqui se determina que se hace cuando el usuario obtenido
        //esta registrado o es anonymous
        if (user) {//aqui va MovilApp.infoUser.iuRegister para probar offline, user para online
            if (user != null) {
                MovilApp.infoUser.iuEmail = user.email;//"un@email.cualquiera"
                //aqui debe hacer una consulta a la BD de PostgreSQL, 
                //preguntando por el usuario con un email como iuEmail
                //para obtener sus atributos (nombre, rol, etc)
                MovilApp.infoUser.iuFullName = "Here's name goes";
                MovilApp.infoUser.iuRegister = true;
            }
        } else {
            MovilApp.infoUser.iuEmail = "";
            MovilApp.infoUser.iuFullName = "Anonymous";
            MovilApp.infoUser.iuRegister = false;
        }
        console.log('iuEmail>> ', MovilApp.infoUser.iuEmail);
        console.log('iuFullName>> ', MovilApp.infoUser.iuFullName);
        console.log('iuRegister>> ', MovilApp.infoUser.iuRegister);
    });

    MovilApp.app.router.register(":view/:id", { view: "home", id: undefined });
    MovilApp.app.on("navigatingBack", onNavigatingBack);
    MovilApp.app.navigate();
});
