module.exports = function () {
    var faker = require( 'faker' );
    var _ = require( 'lodash' );

    var productName = function(){
        return faker.commerce.productAdjective() +
        ' ' +
        faker.commerce.productMaterial() +
        ' Widget'
    };

    var productImage = function(){
        return faker.image.imageUrl();
    };

    return {
        getUserInfo: {
            avatar: faker.internet.avatar(),
            firstName: faker.name.firstName(),
            id: "00561000000L6lTAAS",
            lastName: faker.name.lastName(),
            name: faker.name.findName()
        },
        yo: _.times( 6, function ( id ) {
            var title = productName();
            return {
                id: id+1,
                title: title,
                image: productImage(),
                price: faker.commerce.price(),
                description: faker.lorem.paragraph(),
                summary: faker.lorem.paragraph()
            }
        } ),
        products: _.times( 9, function ( id ) {
            var title = productName();
            return {
                id: id+1,
                title: title,
                image: productImage(),
                price: faker.commerce.price(),
                description: faker.lorem.paragraph(),
                summary: faker.lorem.paragraph()
            }
        } )
    }
}
