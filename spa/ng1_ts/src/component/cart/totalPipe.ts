import { Pipe } from 'angular2/core';

@Pipe({name: 'cartTotal'})
export class TotalPipe {
    transform(value) {
        let total = 0;
        if(value){
            value.forEach(cartItem => {
                total += cartItem.qty * cartItem.price;
            });
        }
        return total;
    }
}