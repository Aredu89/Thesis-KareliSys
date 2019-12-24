//ubicarse en Program Files\MongoDB\Server\4.2\bin
//correr $ .\mongo 'C:\Users\Ariel\OneDrive\Ing en Sistemas IUA\0_THESIS\0_KareliSys\Branch KareliSys\scripts\init.mongo.js'

db = new Mongo().getDB('karelisys')

db.fabricas.remove({})

db.fabricas.insert(
  {
    nombre:"Fabrica Leon",
    direccion:"Las Lilas 1234",
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
    pedidos:[
      {
        numero: 1,
        fecha: new Date(),
        detalle: [
          {
            idProducto: 1,
            nombre: "Zapato Liso",
            cantidad: 10
          },
          {
            idProducto: 2,
            nombre: "Zapato Cayman",
            cantidad: 8
          },
        ],
        precioTotal: 2800,
        estado: "a pagar",
        pagos: [
          {
            fecha: new Date(),
            monto: 1000
          }
        ]
      }
    ]
  }
)

db.fabricas.insert(
  {
    nombre:"Fabricas de Botas Pedro",
    direccion:"Leones 432",
    ciudad:"León, Guanajuato",
    telefono:6543216422,
    contactos:[
      {
        nombre:"Pablo",
        apellido:"Perez",
        email:"pp@hotmail.com",
        telefono:123654789
      },
      {
        nombre:"Gabriel",
        apellido:"Gomez",
        email:"gg@hotmail.com",
        telefono:123987654
      }
    ],
    pedidos:[
      {
        numero: 1,
        fecha: new Date(),
        detalle: [
          {
            idProducto: 1,
            nombre: "Zapato Liso",
            cantidad: 10
          },
          {
            idProducto: 2,
            nombre: "Zapato Cayman",
            cantidad: 8
          },
        ],
        precioTotal: 2800,
        estado: "a pagar",
        pagos: [
          {
            fecha: new Date(),
            monto: 1000
          }
        ]
      }
    ]
  }
)