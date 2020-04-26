const Validator = require("validator")
const isEmpty = require("is-empty")

module.exports = function validateRegisterInput(data) {
  let errors = {
    message: ""
  };
// Convierto valores vacíos en strings para poder usar el Validatos
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
// Controlo nombre
  if (Validator.isEmpty(data.name)) {
    errors.message = "El nombre es requerido ";
  }
// Controlo email
  if (Validator.isEmpty(data.email)) {
    errors.message = (errors.message ? errors.message : "") + "El email es requerido ";
  } else if (!Validator.isEmail(data.email)) {
    errors.message = (errors.message ? errors.message : "") + "El formato de email es inválido ";
  }
// Controlo password
  if (Validator.isEmpty(data.password)) {
    errors.message = (errors.message ? errors.message : "") + "El password es requerido ";
  }
if (Validator.isEmpty(data.password2)) {
  errors.message = (errors.message ? errors.message : "") + "Es necesario confirmar el password ";
  }
if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
  errors.message = (errors.message ? errors.message : "") + "El password debe tener por lo menos 6 caracteres y máximo 30 ";
  }
if (!Validator.equals(data.password, data.password2)) {
  errors.message = (errors.message ? errors.message : "") + "El password debe coincidir ";
  }
return {
    errors,
    isValid: isEmpty(errors.message)
  }
}