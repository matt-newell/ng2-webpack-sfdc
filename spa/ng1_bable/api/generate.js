module.exports = function () {
    var faker = require( 'faker' );
    var _ = require( 'lodash' );

    var productName = function(){
        return faker.commerce.productAdjective() +
        ' ' +
        faker.commerce.productMaterial() +
        ' Widget'
    };


    return {
        product: _.times( 100, function ( id ) {
            var title = productName();
            return {
                id: id+1,
                title: title,
                price: faker.commerce.price(),
                description: faker.lorem.paragraph(),
                summary: 'A damn fine widget'
            }
        } ),
        cart: []
    }
}
