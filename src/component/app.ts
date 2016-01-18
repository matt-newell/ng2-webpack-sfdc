import { Component } from 'angular2/core';
import { RouteConfig, RouterOutlet } from 'angular2/router';
import { Catalog } from './catalog/catalog';
import { ProductDetail } from './product-detail/product-detail';
import { StoreHeader } from './store-header/store-header';
import { Cart } from './cart/cart';

@Component({
    selector: '[ng-store]',
    directives: [Catalog, ProductDetail, StoreHeader, RouterOutlet],
    template: require('./app.html')
})
@RouteConfig([
    {path: '/', name: 'Home', component: Catalog},
    {path: '/product/:productId', name: 'ProductDetail', component: ProductDetail},
    {path: '/cart', name: 'Cart', component: Cart},
])
export class App {}
