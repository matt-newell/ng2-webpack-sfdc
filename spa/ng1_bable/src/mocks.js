//-- polyfill sfdc stuff -----------------------------//
var configSettings = configSettings || {},
    $A = $A || (function () {
        return {
            get: function () { return this; },
            setParams: function () {},
            fire: function () {}
        };
    }()),
    $Lightning = $Lightning || { use: function () {} };
//-- end polyfill ------------------------------------//

configSettings = {
    staticPath: '',
    config: {  },
    remoteActions: {
        getSidebar      : '{!$RemoteAction.AlfredHomeController.getSidebar}',
        getUserInfo     : '{!$RemoteAction.AlfredHomeController.getUserInfo}',
        yo              : '{!$Testy.say.yo.me.newell}'
    },
    mocks: {
        '{!$RemoteAction.AlfredHomeController.getSidebar}' : 'getSidebar',
        '{!$RemoteAction.AlfredHomeController.getUserInfo}' : 'getUserInfo',
        '{!$Testy.say.yo.me.newell}': 'products6',
        //String value of your mock matches json object on json-server
        '{!$Testy.say.yo.me.newell.Simple.Object}': {
            timeout : 5000,
            method : function(){
                return {
                    "yo" : "my name is yo"
                };
            }
        }
    }
};
