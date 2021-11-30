require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {

    getOrders: (req, res) => {
        sequelize.query(`SELECT c.client_name, o.date, b.brand_name, f.film_name, o.paid, o.notes
        FROM orders o
        JOIN clients c ON c.client_id = o.client_id
        JOIN film f ON o.film_id = f.film_id
        JOIN film_brands b ON b.brand_id = f.film_id
        `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err, 'orders err'))
    },

    createOrder: (req, res) => {
        const {film, notes, client, date} = req.body

        sequelize.query(`INSERT INTO orders (client_id, date, notes, film_id, paid)
        VALUES (${client}, '${date}', '${notes}', ${film}, false );
        
        SELECT c.client_name, o.date, b.brand_name, f.film_name, o.paid, o.notes, o.order_id
        FROM orders o
        JOIN clients c ON c.client_id = o.client_id
        JOIN film f ON o.film_id = f.film_id
        JOIN film_brands b ON b.brand_id = f.film_id
        ORDER BY order_id DESC LIMIT 1;`).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    markPaid: (req, res) => {
        let {order_id} = req.body
        console.log(order_id)
        sequelize.query(`update orders
        set paid = true
        where order_id = ${order_id}
        returning *;`)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    }

}