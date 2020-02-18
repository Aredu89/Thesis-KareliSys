const Validator = require("validator")
const isEmpty = require("is-empty")

module.exports = function validateLoginInput(data) {
  let errors = {};
// Convierto valores vacíos en strings para poder usar el Validatos
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
// Controlo email
  if (Validator.isEmpty(data.email)) {
    errors.email = "El email es requerido";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "El email es inválido";
  }
// Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "El password es requerido";
  }
return {
    errors,
    isValid: isEmpty(errors)
  };
};