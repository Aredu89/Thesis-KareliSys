const mongoose = require('mongoose')
const Usuarios = mongoose.model('Usuarios')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const keys = require("../config/keys")
// Load input validation
const validateRegisterInput = require("../validation/register")
const validateLoginInput = require("../validation/login")

module.exports.registrarUsuarios = (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body)

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }
  Usuarios.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Ya existe una cuenta con ese Email" })
    } else {
      const newUser = new Usuarios({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })
  // Hash password antes de guardar en la base de datos
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
}

module.exports.loguearUsuarios = (req, res) => {
  const { error, isValid } = validateLoginInput(req.body);
  // Validar
  if (!isValid) {
    return res.status(400).json(error);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Encontrar usuario por el email
  Usuarios.findOne({ email }).then(user => {
    // Chequear si el usuario existe
    if (!user) {
      return res.status(404).json({ message: "Email no encontrado" });
    }
  // Validar password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };
        // Crear token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 año en segundos
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              user: user
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ message: "Password incorrecto" });
      }
    });
  });
}