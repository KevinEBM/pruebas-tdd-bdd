// cucumber lee los .feature de tests/bdd y los pasos de tests/bdd/steps
module.exports = {
  default: {
    paths: ['tests/bdd/**/*.feature'],
    require: ['tests/bdd/steps/**/*.js'],
    format: ['pretty'] // para que muestre cada escenario con su nombre
  }
};
