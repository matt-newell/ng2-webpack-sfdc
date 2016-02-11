import { Component } from 'angular2/core';
import { RouterLink, RouteParams } from 'angular2/router';
import { StoreService }  from '../../service/store-service';
import { CartService }  from '../../service/cart-service';

@Component({
    directives: [RouterLink],
    selector: 'product-detail',
    template: require('./product-detail.html')
})

export class ProductDetail {
    product: any;
    productId: string;

    constructor(private storeService:StoreService, private cartService:CartService, private routeParams:RouteParams) {
        this.product = {};
        this.productId = this.routeParams.get('productId');
    }

    getProduct() {
        this.storeService.getProduct(this.productId).then(res => this.product = res);
        this.cartService.getCart();
    }

    ngOnInit() {
        this.getProduct()
    }

    addItem(product) {
        this.storeService.addItem(product).then(data => this.getProduct());
    }
}