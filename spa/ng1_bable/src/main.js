import './main.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './app.config';
//TODO move to a core module to load all deps
import header from './components/header/header.directive';
import home from './features/home';

angular.element(document).ready(() => {
    angular.module('app', [uirouter, header, home])
      .config(routing);

    angular.bootstrap(document, ['app']);
});

// import angualr from 'angular';
// import './main.scss';
//
// var ngModule = angular.module('ngModule', []);
// ngModule.controller('DemoCtrl', function DemoCtrl() {
//     this.message = "Hallo Welt";
//     this.products = [
//         {id:1},
//         {id:2},
//         {id:3},
//         {id:4},
//         {id:4},
//         {id:4}
//     ];
//     console.log(this.message);
// });
// angular.element(document).ready(() => {
//     angular.bootstrap(document, ['ngModule']);
// });
