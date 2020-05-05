'use strict'

const { promisify } = require('util')
const Client = require('./client')

const OrderService = () => {
    const client = Client()
    
    // List
    const listPromisify = promisify(client.list).bind(client)
    const list = async(params, meta) => {
        const result = await listPromisify(params, meta)

        return result
    }
    
    // Data
    const dataPromisify = promisify(client.data).bind(client)
    const data = async(params, meta) => {
        const result = await dataPromisify(params, meta)

        return result
    }

    return {
        list,
        data
    }
}

module.exports = OrderService
