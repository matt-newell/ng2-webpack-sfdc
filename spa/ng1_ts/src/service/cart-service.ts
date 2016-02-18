/**
 * Service using Observables
 */

import {Http, Headers } from 'angular2/http';
import {Injectable} from 'angular2/core';
import {CartItem} from './cart-item-model.ts';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

const BASE_URL = 'http://localhost:9000';
const jsonHeader = new Headers();
jsonHeader.append('Content-Type', 'application/json');

@Injectable()
export class CartService {
    public cart$: Observable<Array<CartItem>>;
    private _cartObserver: any;
    private _cartStore: {
        cart: Array<CartItem>
    };

    constructor(private http: Http) {
        this.createCartObserver();
    }

    createCartObserver() {
        this._cartStore = {cart: []};
        this.cart$ = new Observable((observer: any) => {
            this._cartObserver = observer;
        }).share();
        this.cart$.subscribe();
    }

    getCart() {
        this.http.get(`${BASE_URL}/cart`).subscribe(data => {
            this._cartStore.cart = data.json();
            this._cartObserver.next(this._cartStore.cart);
        });
    }

    increaseItem(cartItem: CartItem) {
        this.transact('patch', `${BASE_URL}/cart/${cartItem.id}`, {qty: cartItem.qty + 1}).subscribe(() => {
            this._cartStore.cart.find(item => cartItem.id === item.id).qty++;
            this._cartObserver.next(this._cartStore.cart);
        });
    }

    decreaseItem(cartItem: CartItem) {
        if (cartItem.qty > 1) {
            this.transact('patch', `${BASE_URL}/cart/${cartItem.id}`, {qty: cartItem.qty - 1}).subscribe(() => {
                this._cartStore.cart.find(item => cartItem.id === item.id).qty--;
                this._cartObserver.next(this._cartStore.cart);
            });
        } else {
            this.removeItem(cartItem);
        }
    }

    removeItem(cartItem: CartItem) {
        this.transact('delete', `${BASE_URL}/cart/${cartItem.id}`).subscribe(() => {
            this._cartStore.cart = this._cartStore.cart.filter(item => cartItem.id !== item.id);
            this._cartObserver.next(this._cartStore.cart);
        });
    }

    transact(method, url, payload?) {
        if (!payload || typeof payload === 'string') {
            return this.http[method](url, payload)
                .map(res => res.json());
        } else {
            return this.http[method](url, JSON.stringify(payload), {headers: jsonHeader})
                .map(res => res.json());
        }
    }

    cartTotals(qty = 0, total = 0) {
        this._cartStore.cart.forEach(cartItem => {
            qty += cartItem.qty;
            total += cartItem.qty * cartItem.price;
        });
        return {qty, total};
    }
}