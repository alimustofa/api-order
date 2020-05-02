'use strict'

const router = require('express').Router()

const Controller = require('./controller')

const OrderService = require('../order/service')

const Route = () => {

    // Order Service
    const OrderServiceObj = OrderService()
    const orderController = Controller(OrderServiceObj)
    
    router.get('/:type', orderController.list)

    return router
}

module.exports = Route