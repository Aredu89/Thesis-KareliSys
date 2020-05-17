const mongoose = require('mongoose')
const Usuarios = mongoose.model('Usuarios')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const keys = require("../config/keys")
// Load input validation
const validateRegisterInput = require("../validation/register")
const validateLoginInput = require("../validation/login")

module.exports.listaUsuarios = (req, res) => {
  Usuarios
    .find({})
    .exec((err, results, status) => {
      if(!results || results.length < 1){
        res.status(404).json({ message: "No se encontraron usuarios"})
      } else if (err) {
        res.status(404).json(err)
      } else {
        res.status(200).json(results)
      }
    })
}

//Obtengo un usuario
module.exports.getUsuario = (req, res) => {
  //Controlamos que el id de la fabrica esté en el parámetro
  if (req.params && req.params.id) {
    Usuarios
      .findById(req.params.id)
      .exec((err, usuario) => {
        //Si el id específico no existe en la BD
        if (!usuario) {
          res.status(404).json({ message: "Id de usuario no encontrado"})
        //Si la BD devuelve un error
        } else if (err) {
          res.status(404).json(err)
        } else {
            //Se devuelve el documento encontrado
            res.status(200).json(usuario)
        }
    })
  } else {
    res.status(404).json({ message: "No se envió el id como parámetro"})
  }
}

//Modificar un usuario
module.exports.modificarUsuario = (req,res) => {
  if (!req.params.id) {
    res.status(404).json({ message: "Se requiere el id del usuario"})
    return
  }
  const auxUsuario = req.body
  Usuarios
    .findById(req.params.id)
    .select('-creada')
    .exec(
      (err,usuario) => {
        if (!usuario) {
          res.status(404).json({ message: "No se encontró el id del usuario"})
          return
        } else if (err) {
          res.status(404).json(err)
          return
        }
        //Si no hay error, reemplazo con los datos del body
        usuario.name = auxUsuario.name
        usuario.email = auxUsuario.email
        usuario.password = auxUsuario.password ? auxUsuario.password : usuario.password
        usuario.permits = auxUsuario.permits

        // Controlo que queden usuarios con permisos
        if(!usuario.permits){
          let validacionPermits = false
          Usuarios
            .find({})
            .exec((err, results, status) => {
              if(!results || results.length < 1){
                res.status(404).json({ message: "No se pudieron controlar los permisos de usuarios"})
                return
              } else if (err) {
                res.status(404).json(err)
                return
              } else {
                // Asigno el false al permits del usuario modificado
                const auxResults = results.map(res=>{
                  if(res._id.toString() === usuario._id.toString()){
                    res.permits = false
                  }
                  return res
                })
                // Controlo si queda algun usuario con permits = true
                auxResults.forEach(res=>{
                  if(res.permits){
                    validacionPermits = true
                  }
                })
              }
              if(validacionPermits === false){
                res.status(400).json({ message: "Debe quedar al menos un usuario con permisos"})
                return
              } else {
                //Si no hay error, guardo los cambios
                if(auxUsuario.password){
                  // Hash password antes de guardar en la base de datos
                  bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(usuario.password, salt, (err, hash) => {
                      if (err) throw err
                      usuario.password = hash
                      usuario.save((err, usuario) => {
                        if (err) {
                          res.status(404).json(err)
                        } else {
                          res.status(201).json(usuario)
                        }
                      })
                    })
                  })
                } else {
                  usuario.save((err, usuario) => {
                    if (err) {
                      res.status(404).json(err)
                    } else {
                      res.status(201).json(usuario)
                    }
                  })
                }
              }
            })
        } else {
          if(auxUsuario.password){
            // Hash password antes de guardar en la base de datos
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(usuario.password, salt, (err, hash) => {
                if (err) throw err
                usuario.password = hash
                usuario.save((err, usuario) => {
                  if (err) {
                    res.status(404).json(err)
                  } else {
                    res.status(201).json(usuario)
                  }
                })
              })
            })
          } else {
            usuario.save((err, usuario) => {
              if (err) {
                res.status(404).json(err)
              } else {
                res.status(201).json(usuario)
              }
            })
          }
        }
      }
    )
}

//Eliminar un usuario
module.exports.eliminarUsuario = (req,res) => {
  if (!req.params.id) {
    res.status(404).json({ message: "Se requiere el id del usuario"})
    return
  }
  // Controlo que queden usuarios con permisos
  let validacionPermits = false
  Usuarios
    .find({})
    .exec((err, results, status) => {
      if(!results || results.length < 1){
        res.status(404).json({ message: "No se pudieron controlar los permisos de usuarios"})
        return
      } else if (err) {
        res.status(404).json(err)
        return
      } else {
        // Asigno el false al permits del usuario modificado
        const auxResults = results.map(res=>{
          if(res._id.toString() === req.params.id.toString()){
            res.permits = false
          }
          return res
        })
        // Controlo si queda algun usuario con permits = true
        auxResults.forEach(res=>{
          if(res.permits){
            validacionPermits = true
          }
        })
      }
      if(validacionPermits === false){
        res.status(400).json({ message: "Debe quedar al menos un usuario con permisos"})
        return
      } else {
        //Si paso la validación, elimino el usuario
        Usuarios
          .findByIdAndRemove(req.params.id)
          .exec(
            (err, usuario) => {
              if(err){
                res.status(404).json(err)
              } else {
                res.status(204).json(null)
              }
            }
          )
            }
          })
}

module.exports.registrarUsuarios = (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body)

  // Check validation
  if (!isValid) {
    console.log("not valid")
    return res.status(400).json(errors)
  }
  Usuarios.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ message: "Ya existe una cuenta con ese Email" })
    } else {
      const newUser = new Usuarios({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        permits: false
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
          name: user.name,
          permits: user.permits
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