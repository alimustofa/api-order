'use strict'


const listEndpoint = require('./endpoint/list')
const dataEndpoint = require('./endpoint/data')

const Controller = (service) => {    
    const list = listEndpoint(service)
    const data = dataEndpoint(service)

    return {
        list,
        data
    }
}
    

module.exports = Controller