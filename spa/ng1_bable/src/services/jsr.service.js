/* globals Visualforce */
'use strict';

/**
 * EXAMPLE USE
 *
 * ### Importing and configuring ###
 *
 * import jsrPromise from '../helpers/jsr-promise';
 * var jsr = jsrPromise({
 *   actions: window.myProject.actions,
 *   namespace: 'customNamespace',
 *   mockActions: window.mocks,
 *   mockResponseWait: 1000
 * });
 *
 * ### Using JSR Promise ###
 *
 * var upsertData = opts => {
 *   opts.data = opts.data || { FirstName: 'John', LastName: 'Doe'}
 *
 *   if (opts.id) {
 *     //return jsr because we have promise
 *     return jsr({method: 'addUser', args: [opts.data]}, options: {timeout: 4000}});
 *   }
 *
 *   return jsr({method: 'updateUser', args: [opts.id, opts.data]})
 *     .then(showUpdate);
 * };
 *
 * ### Using Mocks ###
 *
 * jsr-promise takes advantage of the fact that valid JSON cannot include functions.
 * If there is a function in the return, then the function is passed the args Object
 * and the result of calling the function is then parsed too.
 *
 * This is very flexible, but can cause infinite loops in a few cases
 * If you function returns a function, that function will also run, so make sure it terminates
 * If your functions create objects that create functions, make sure this process ends
 * If your objects or arrays reference themselves, it loops forever
 *
 * var makeAddress = () => {
 *   //something to make random addresses
 *   return '123 Random Address Here';
 * };
 *
 * var actions = {
 *   //This will run "as is"
 *   getUsers: [
 *     {
 *       Name: "Random Dude",
 *       Address: "123 Somewhere Ln Nowhere, MD 12345"
 *     },
 *     {
 *       Name: "Awesome Dev",
 *       Address: "123 Eternity Dr. Java, Ca 13375"
 *     }
 *   ],
 *   addUser(data, forceFail) {
 *     if (forceFail) {
 *       return {status: "fail", reason: "You Suck!!"};
 *     }
 *     return {
 *       Name: `${data.FirstName} ${data.LastName}`,
 *       Address: makeAddress()
 *     };
 *   }
 * };
 */


//import { merge } from '../../../utils/utils';
//import { encode, decode } from './namespacer';
//var needsNamespace = item => item !== null && (Array.isArray(item) || typeof item === 'object');

var makeMock = (data, args, forceFail) => {
    //TODO: still allows regex. Should throw instead
    //if it's a function, recurse passing given args
    if (typeof data === 'function') {
        return makeMock(data(args), args, forceFail);
    }

    //if it's an array, recurse for each item
    if (Array.isArray(data)) {
        return data.map(item => {
            return makeMock(data(item, args, forceFail));
        });
    }

    //if it's a non-null object, recurse for each key
    var key;
    if (typeof data === 'object' && data !== null) {
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                data[key] = makeMock(data[key], args, forceFail);
            }
        }
    }

    //if it's a primitive, then return it unchanged
    return data;
};

/**
 * @private mockJsr
 * dispatches mock data after timeout period and returns promise object
 * mocks are special in that they have a forceFail Boolean
 * and a forceFailAction to handle that event
 */
var mockJsr = config => opts => {
    return new Promise((resolve, reject) => {
        var action = config.mockActions[opts.method];

        window.setTimeout(() => {
            if (opts.forceFail) {
                reject(makeMock(opts.forceFailAction, opts.args, true));
            }
            resolve(makeMock(action, opts.args));
        }, config.mockResponseWait);

    });
};

var realJsr = config => opts => {
    return new Promise((resolve, reject) => {
        var ns = config.namespace;
        opts.args = Array.isArray(opts.args) ? opts.args : [];
        var options = {
            buffer: true,
            escape: true,
            timeout: 30000
        };

        //create array of arguments with given method
        var toSend = [config.actions[opts.method]];

        //for each arg, namespace if it is an object or array
        //skip the namespace check
        opts.args.forEach(arg => {
            toSend.push(arg);
        });
        //add callback wrapper
        toSend.push((result, event) => {
            if (event.status) {
                //decode result if needed
                //resolve(needsNamespace(result) ? decode(ns, result) : result);
                resolve(result);
            } else {
                reject(event);
            }
        });
        //add options
        toSend.push(options);

        //do the request
        Visualforce.remoting.Manager.invokeAction.apply(Visualforce.remoting.Manager, toSend);
    });
}; //END realJsr

/**
 * @func jsrPromise
 * configures JSR and dispatches either a real or false JSR call
 * @param {Object} config - object with config options
 *   {Boolean} forceTest - force mocks if true ok
 *   {Object} actions - object linking names to JSR names (or mocks)
 *                      default is `window.cs.actions`
 *   {Object} mockActions - object linking names to mocks
 *                          is same as actions if none given
 *   {String} namespace - name to use for namespaces (ignored for mocks)
 *                        default is empty string
 *   {Number} mockResponseWait - how long to wait for response in ms (default: 0)
 * @return {Function} - either real JSR or mock JSR Function
 */
var jsrPromise = config => {
    if (typeof config.actions !== 'object') {
        window.cs = window.cs || {};
        window.cs.actions = window.cs.actions || {};
        config.actions = window.cs.actions;
    }

    if (typeof config.mockActions !== 'object') {
        config.mockActions = config.actions;
    }

    if (typeof config.namespace !== 'string') {
        config.namespace = '';
    }

    if (typeof config.mockResponseWait !== 'number') {
        config.mockResponseWait = 0;
    }

    //dispatch on type
    if (window.Visualforce && !config.forceTest) {
        return realJsr(config);
    }
    return mockJsr(config);
};

export default jsrPromise;
