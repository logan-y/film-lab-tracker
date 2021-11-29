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
    // getCurrentOrders: (req, res) => {
    //     sequelize.query(`select * from orders
    //     where paid = true
    //     order by date desc;`)
    //         .then(dbRes => res.status(200).send(dbRes[0]))
    //         .catch(err => console.log(err, 'paid orders err'))
    // },

    getPaidOrders: (req, res) => {
        sequelize.query(`SELECT *
        FROM orders;
        `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err, 'paid orders err'))
    }
}