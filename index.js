'use strict'

require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const port = process.env.PORT || 9001
const app = express()

// utils
const { initDb, getEvmDbMaster } = require('./utils/db')
// routes
const ProductRoutes = require('./src/api-product/route')
const OrderRoutes = require('./src/api-order/route')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))

app.get('/', async(req, res) => {
    res
        .status(200)
        .json({
            status: 200,
            code: null,
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

    app.use(function(_, res) {
        res
            .status(404)
            .json({
                status: 404,
                code: null,
                message: 'Not found',
                data: null,
            })
    })
    
    app.listen(port, () => console.log(`Service listening at http://localhost:${port}`))
})

module.exports = app