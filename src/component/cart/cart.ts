import {Component} from 'angular2/core';
import { CartService }  from '../../service/cart-service';
import { RouterLink } from 'angular2/router';
import { TotalPipe } from './totalPipe';

@Component({
    directives: [RouterLink],
    selector: '[cart]',
    pipes: [TotalPipe],
    template: require('./cart.html')
})

export class Cart {
    products: Array<any>;

    constructor(private cartService: CartService) {
        cartService.cart$.subscribe(updatedCart => {
            this.products = updatedCart;
        });
    }

    ngOnInit() {
        this.cartService.getCart();
    }

    removeItem(product) {
        this.cartService.removeItem(product);
    }

    increaseItem(product) {
        if (product.qty > 0) {
            this.cartService.increaseItem(product);
        } else {
            this.removeItem(product);
        }
    }

    decreaseItem(product) {
        this.cartService.decreaseItem(product);
    }
}
