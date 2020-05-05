'use strict'

const router = require('express').Router()

const Controller = require('./controller')

const ProductService = require('../svc-product/service')

const Route = () => {

    // Product Service
    const ProductServiceObj = ProductService()

    const productController = Controller(ProductServiceObj)
    
    router.get('/', productController.list)

    return router
}

module.exports = Route