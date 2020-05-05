'use strict'

const router = require('express').Router()

const Controller = require('./controller')

const OrderService = require('../svc-order/service')

const Route = () => {

    // Order Service
    const OrderServiceObj = OrderService()
    const orderController = Controller(OrderServiceObj)
    
    router.get('/', orderController.list)
    router.get('/:orderCode', orderController.data)

    return router
}

module.exports = Route