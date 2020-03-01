const Validator = require("validator")
const isEmpty = require("is-empty")

module.exports = function validateLoginInput(data) {
  let error = {};
// Convierto valores vacíos en strings para poder usar el Validatos
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
// Controlo email
  if (Validator.isEmpty(data.email)) {
    error.message = "El email es requerido";
  } else if (!Validator.isEmail(data.email)) {
    error.message = "El email es inválido";
  }
// Password checks
  if (Validator.isEmpty(data.password)) {
    error.message = "El password es requerido";
  }
return {
    error,
    isValid: isEmpty(error)
  };
};