// NOTE object below must be a valid JSON
window.MovilApp = $.extend(true, window.MovilApp, {
    "config": {
		"layoutSet": "navbar",
		"navigation": [
			{
				"title": "Home",
				"onExecute": "#home",
				"icon": "home"
			},
			{
				"title": "About",
				"onExecute": "#about",
				"icon": "info"
			}
		],
		"commandMapping": {
			"ios-header-toolbar": {
				"commands": [
					{
						"id": "LogIn",
						"location": "after"
					}
				]
			},
			"android-footer-toolbar": {
				"commands": [
					{
						"id": "LogIn",
						"location": "after"
					}
				]
			},
			"generic-header-toolbar": {
				"commands": [
					{
						"id": "LogIn",
						"location": "after"
					}
				]
			},
			"win10-phone-appbar": {
				"commands": [
					{
						"id": "LogIn",
						"location": "after"
					}
				]
			}
		}
	}
});