import {Component, OnInit} from 'angular2/core';
import { CartService }  from '../../service/cart-service';
import { RouterLink } from 'angular2/router';

@Component({
  directives: [RouterLink],
  selector: '[store-header]',
  template: require('./store-header.html')
})

export class StoreHeader {
    totals: any;
    constructor(private cartService: CartService) {
        this.totals = {};
        cartService.cart$.subscribe(updatedCart => {
            this.totals = cartService.cartTotals();
        });
    }
    ngOnInit() {
        this.cartService.getCart();
    }
}
