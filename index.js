'use strict'

require('dotenv').config()

const express = require('express')
const port = process.env.PORT || 9001
const app = express()

// utils
const { initDb, getEvmDbMaster } = require('./utils/db')
// routes
const ProductRoutes = require('./src/apiProduct/route')
const OrderRoutes = require('./src/apiOrder/route')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async(req, res) => {
    res
    .status(200)
    .json({
        status: 200,
        message: 'Service is alive',
        data: {
            name: 'service-boiler',
            isAlive: true,
        },
    })
})

initDb(async err => {
    if (err) throw err
    // product route
    const productRoutes = ProductRoutes()
    app.use('/product', productRoutes)
    
    // order route
    const orderRoutes = OrderRoutes()
    app.use('/order', orderRoutes)
    
    app.listen(port, () => console.log(`Service listening at http://localhost:${port}`))
})

module.exports = app