export default class HomeController {
  constructor(randomNames) {
    this.random = randomNames;
    this.name = 'World';
  }

  changeName() {
    this.name = 'Code | Science';
  }

  randomName() {
    this.name = this.random.getName();
  }
}

HomeController.$inject = ['randomNames'];
