var angular = require('angular');
import './main.scss';
//import * as angular from 'angular';

var ngModule = angular.module('ngModule', []);
ngModule.controller('DemoCtrl', function DemoCtrl() {
    this.message = "Hallo Welt";
    this.products = [
        {id:1},
        {id:2},
        {id:3},
        {id:4},
        {id:4},
        {id:4}
    ];
    console.log(this.message);
});
angular.element(document).ready(() => {
    angular.bootstrap(document, ['ngModule']);
});
