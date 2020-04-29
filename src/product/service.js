'use strict'

const { promisify } = require('util')
const Client = require('./client')

const ProductService = () => {
    const client = Client()

    // let list = (cb) => {
    //     client.list({}, (error, notes) => {
    //         if (!error) {
    //             console.log('successfully fetch List notes 132')
    //             console.log(notes)

    //             return cb(null, notes)
    //         }
    //     })
    // }
    
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
