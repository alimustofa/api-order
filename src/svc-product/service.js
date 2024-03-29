'use strict'

const { promisify } = require('util')
const Client = require('./client')

const ProductService = () => {
    const client = Client()

    const listPromisify = promisify(client.list).bind(client)
    const list = async(params) => {
        const result = await listPromisify(params)

        return result
    }

    return {
        list
    }
}

module.exports = ProductService
