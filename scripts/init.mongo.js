//ubicarse en Program Files\MongoDB\Server\4.2\bin
//correr $ .\mongo 'C:\Users\Ariel\OneDrive\Ing en Sistemas IUA\0_THESIS\0_KareliSys\Branch KareliSys\scripts\init.mongo.js'

db = new Mongo().getDB('karelisys')

db.fabricas.remove({})

db.fabricas.insert(
  {
    nombre:"Fabrica Leon",
    direccion:"",
    ciudad:"León, Guanajuato",
    telefono:6543216464,
    contactos:[
      {
        nombre:"Juan Alberto",
        apellido:"Hernandez",
        email:"pepito@hotmail.com",
        telefono:987654321
      },
      {
        nombre:"Enzo",
        apellido:"Fernandez",
        email:"enzito@hotmail.com",
        telefono:123987654
      }
    ],
    pedidos:[]
  }
)