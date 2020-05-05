'use strict'

const grpc = require('grpc')
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing')
const tracer = require('../../../utils/tracer')

module.exports = (service) => async (req, res) => {
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
    const orderType = req.query.type || 'pending'
    const userId = 100000018521

    if (!availableTypes.includes(orderType)) {
        return res
            .status(400)
            .json({
                status: 400,
                code: null,
                message: 'Type not found',
                data: null,
            })
    }

    const meta = new grpc.Metadata()
    meta.set('processId', JSON.stringify(processId))

    let result
    try {
        const params = {
            userId,
            orderType,
            page,
            size
        }
        result = await service.list(params, meta)
    } catch (e) {
        apiListOrderSpan
            .setTag(Tags.ERROR, true)
            .log({ error: e })

        return res
            .status(500)
            .json({
                status: 500,
                code: null,
                message: 'Whops, ada kesalahan sistem',
                data: null,
            })
    } finally {
        apiListOrderSpan.finish()
    }

    return res
        .status(200)
        .json(result)
}