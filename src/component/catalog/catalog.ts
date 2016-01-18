import { Component } from 'angular2/core';
import { StoreService }  from '../../service/store-service';
import { CartService }  from '../../service/cart-service';
import { RouterLink } from 'angular2/router';
import '../../scss/fonts.scss';
import './catalog.scss';

@Component({
    directives: [RouterLink],
    selector: '[catalog]',
    template: require('./catalog.html')
})

export class Catalog {
    products: Array<any>;
    constructor(private storeService:StoreService,private cartService:CartService) {
    }

    getCatalog() {
        this.storeService.getCatalog().then(res => this.products = res);
        this.cartService.getCart();
    }

    ngOnInit() {
        this.getCatalog();
    }

    addItem(product) {
        this.storeService.addItem(product).then(data => this.getCatalog());
    }
}
