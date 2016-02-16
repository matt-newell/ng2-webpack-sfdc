export default class HomeController {
  constructor(randomNames, jsr) {
    this.random = randomNames;
    this.name = 'World';
    this.myProducts = {};
    this.jsr = jsr;
  }

  getProducts() {

      this.myProducts = this.jsr({
          method: configSettings.remoteActions.newell,
          args: []
      })
      .then(result => console.log(result) );
  }

  changeName() {
    this.name = 'Code | Science';
  }

  randomName() {
    this.name = this.random.getName();
  }
}

HomeController.$inject = ['randomNames', 'jsr'];
