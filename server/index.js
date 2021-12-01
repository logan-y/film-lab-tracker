
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const {SERVER_PORT} = process.env
const {seed} = require('./seed.js')
const {
        getOrders,
        createOrder,
        markPaid,
        orderPaid
        } = require('./controller.js');


app.use(express.json());
app.use(cors());


app.post('/seed', seed)
app.get('/orders', getOrders)
app.post('/orders', createOrder)
app.put('/orders', markPaid)
app.get('/paidOrder', orderPaid)

// app.get('/current', getCurrentOrders)
// app.put('/complete', completeOrder)
app.listen(SERVER_PORT, () => console.log(`Server running on ${SERVER_PORT}`));