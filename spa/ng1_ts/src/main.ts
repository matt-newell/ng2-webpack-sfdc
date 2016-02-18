var angular = require('angular');

//import * as angular from 'angular';

var app = angular.module('app', []);
app.controller('DemoCtrl', function DemoCtrl() {
    this.message = "Hallo Welt";
});
angular.element(document).ready(() => {
    angular.bootstrap(document, ['app']);
});




// import { bootstrap } from 'angular2/platform/browser';
// import { HTTP_PROVIDERS } from 'angular2/http';
// import { ROUTER_PROVIDERS } from 'angular2/router';
// import { App } from './component/app';
// import { StoreService }  from './service/store-service';
// import { CartService }  from './service/cart-service';
// import './main.scss';
//
//
// bootstrap(App, [HTTP_PROVIDERS, ROUTER_PROVIDERS, StoreService, CartService]);
