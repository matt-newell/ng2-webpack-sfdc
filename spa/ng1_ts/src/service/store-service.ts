/**
 * Service useing Promises
 */

import { Http, Headers } from 'angular2/http';
import { Injectable } from 'angular2/core';
import { CartItem } from './cart-item-model.ts';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

const BASE_URL = 'http://localhost:9000';
const jsonHeader = new Headers();
jsonHeader.append('Content-Type', 'application/json');

@Injectable()
export class StoreService {
    constructor(private http: Http) {}

    getProduct(id: string) {
        return this.transact('get', `${BASE_URL}/product/${id}/?_embed=cart`);
    }

    getCatalog() {
        return this.transact('get', `${BASE_URL}/product/?_embed=cart`);
    }

    getCartByProduct(id: number) {
        return this.transact('get', `${BASE_URL}/cart/?productId=${id}`);
    }

    addItem(product: CartItem) {
        return this.getCartByProduct(product.id).then(res => {
            if (res[0]) {
                return this.increaseItem(res[0])
            } else {
                let item = {
                    id: 0,
                    productId: product.id,
                    qty: 1,
                    price: product.price,
                    title: product.title
                };
                return this.transact('post', `${BASE_URL}/cart`, item);
            }
        });
    }

    increaseItem(cartItem: CartItem) {
        return this.transact('patch', `${BASE_URL}/cart/${cartItem.id}`, {qty: cartItem.qty + 1});
    }

    transact(method, url, payload?) {
        if (!payload || typeof payload === 'string') {
            return this.http[method](url, payload)
                .map(res => res.json()).toPromise();
        } else {
            return this.http[method](url, JSON.stringify(payload), {headers: jsonHeader})
                .map(res => res.json()).toPromise();
        }
    }
}