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
    config: {
                        hero : '72,69,82,79',
                   heroGiphy : '//giphy.com/embed/13yLVC3RhV5rY4'
                     ////giphy.com/embed/zybS9Wuvgh57y
                     ////giphy.com/embed/HTvhG3r0EZEas
    },
    remoteActions: {
                  getSidebar : '{!$RemoteAction.AlfredHomeController.getSidebar}',
                 getUserInfo : '{!$RemoteAction.AlfredHomeController.getUserInfo}',
                      newell : '{!$Testy.newell}'
    },
    mocks: {
        '{!$RemoteAction.AlfredHomeController.getSidebar}' : {
            timeout : 500,
            method  : function () {
                return [
                    {
                        "id": "A0gjkjfkdsjfkdsf",
                        "name": "Home",
                        "icon": "home",
                        "iconBackground": "rgb(114, 100, 236)",
                        "sequence": 0
                    },
                    {
                        "id": "B99dsfljlkjlkjsdf",
                        "name": "Favorites",
                        "icon": "favorite",
                        "iconBackground": "rgb(232, 82, 126)",
                        "sequence": 1
                    },
                    {
                        "id": "C4asdflkj2lkjsf",
                        "name": "Trails",
                        "icon": "trails",
                        "iconBackground": "rgb(51, 113, 234)",
                        "sequence": 2
                    }
                ];
            }
        },
        '{!$RemoteAction.AlfredHomeController.getUserInfo}' : {
            timeout : 500,
            method  : function () {
                return {
                    "avatar": "//placekitten.com/480/360",
                    "firstName": "Niño&#8217;s",
                    "id": "00561000000L6lTAAS",
                    "lastName": "Newell",
                    "name": "Matt Newell"
                };
            }
        },
        '{!$Testy.newell}': {
            timeout : 5000,
            method : function(){
                return
                    fetch('http://localhost:9000/product')
                    .then(response => response.json() )
                    .then(data => data )
                    .catch(err => console.log(err) );
            }
        },
        '{!$Testy.newell2}': {
            timeout : 500,
            method : function(){
                return {
                    "yo" : "my name is yo"
                };
            }
        }
    }
};
