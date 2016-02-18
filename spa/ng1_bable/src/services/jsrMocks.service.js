'use strict';

function jsrMocks() {
    var $mocks;
    var $mockServer;
    return {
        setMocks: function(mocks, mockServer) {
            $mocks = mocks;
            $mockServer = mockServer;
        },

        $get: function($log,$http,$window,$timeout) {
            if(!window.Visualforce){
                var mocker,
                    mockType = typeof($mocks);
                if(mockType === 'object'){
                    mocker = invokeStaticAction;

                }else{

                    mocker = invokeHTTPAction;
                }

                return {
                    remoting: {
                        Manager: {
                            invokeAction: mocker,
                            invokeHTTPAction: invokeHTTPAction
                        }
                    }
                };

            }else{
                return Visualforce;
            }

            function invokeStaticAction(){
                $log.debug('$mocks is an object:', $mocks);
                var lastArg = arguments[arguments.length - 1],
                    callback = lastArg,
                    mock = $mocks[arguments[0]],
                    result = mock.method(arguments),
                    event = {
                        status: true
                    };
                if (typeof(callback) === 'object') {
                    callback = arguments[arguments.length - 2];
                }
                $timeout(function() {
                    callback(result, event);
                }, mock.timeout);
            }

            function invokeHTTPAction(){
                $log.debug('$mocks is not an object:', mockType, $mockServer);
                var lastArg = arguments[arguments.length - 1],
                    callback = lastArg,

                    mockName = configSettings.mocks[arguments[0]],
                    //used name from configSettings.mocks so its easier to match your json server
                    // mockName = arguments[0],
                    // regex = /(\w*)?}/,
                    // match = regex.exec(mockName),
                    // mockName = match[0].split('\}')[0],

                    url = $mockServer + mockName,
                    event = {
                        status: true
                    };

                if (typeof(callback) === 'object') {
                    callback = arguments[arguments.length - 2];
                }

                $log.debug('http mock url:',url);

                // $http.get(url).
                //     success(function(data,status,headers,config){
                //         var result = data;
                //         $log.debug(data);
                //         setTimeout(function() {
                //             callback(result, event);
                //         }, 100);
                //     }).
                //     error(function(data, status, headers, config) {
                //         $log.error(data, status, headers, config);
                //     });

                fetch(url)
                .then(response => response.json() )
                .then(data => callback(data, event) )
                .catch(err => $log.error(err) );


            }

        }

    };

}

function jsr(jsrMocks,$q,$rootScope){
    var Visualforce = jsrMocks;

    return function(request) {
        var deferred = $q.defer();

        var parameters = [request.method];

        if(request.args){

            for(var i=0;i<request.args.length;i++){
                parameters.push(request.args[i]);
            }
        }

        var callback = function(result, event) {
            $rootScope.$apply(function() {
                if (event.status) {
                    deferred.resolve(result);
                } else {
                    deferred.reject(event);
                }
            });
        };

        parameters.push(callback);

        if(request.options){
            parameters.push(request.options);
        }

        var mockType = typeof( configSettings.mocks[request.method] );
        if(mockType === 'object'){
            Visualforce.remoting.Manager.invokeAction.apply(Visualforce.remoting.Manager, parameters);
        }else {
            Visualforce.remoting.Manager.invokeHTTPAction.apply(Visualforce.remoting.Manager, parameters);
        }

        return deferred.promise;
    };
}

export default angular.module('jsrMocks', [])
    .provider('jsrMocks', jsrMocks)
    .factory('jsr',jsr)
    .name;
