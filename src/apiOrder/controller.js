'use strict'

const grpc = require('grpc')
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing')
const tracer = require('../../utils/tracer')

const Controller = (service) => {
    async function list(req, res) {
        const apiListOrderSpan = tracer.startSpan("order-list")

        const processId = {}
        tracer.inject(apiListOrderSpan, FORMAT_HTTP_HEADERS, processId)

        const availableTypes = [
            'pending', 
            'paid', 
            'sent', 
            'processed', 
            'refund', 
            'return', 
            'expired'
        ]
        const page = req.query.page || 1
        const size = req.query.size || 3
        const orderType = req.params.type

        if (!availableTypes.includes(orderType)) {
            res
                .status(200)
                .json({
                    status: 200,
                    code: 'TYPE_NOT_FOUND',
                    message: 'Tipe order tidak ditemukan',
                    data: null,
                })
        }

        const meta = new grpc.Metadata()
        meta.set('processId', JSON.stringify(processId))

        let result
        try {
            const params = {
                userId: 100000018521,
                orderType,
                page,
                size
            }
            result = await service.list(params, meta)
        } catch (e) {
            apiListOrderSpan
                .setTag(Tags.ERROR, true)
                .log({ error: e })
        } finally {
            apiListOrderSpan.finish()
        }
    
        res
            .status(200)
            .json({
                status: 200,
                code: null,
                message: 'Order data',
                data: result.orders,
            })
    }    

    return {
        list
    }
}
    

module.exports = Controller