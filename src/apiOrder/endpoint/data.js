'use strict'

const grpc = require('grpc')
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing')
const tracer = require('../../../utils/tracer')

module.exports = (service) => async (req, res) => {
    const apiDataOrderSpan = tracer.startSpan("order-data")

    const processId = {}
    tracer.inject(apiDataOrderSpan, FORMAT_HTTP_HEADERS, processId)

    const orderCode = req.params.orderCode
    const userId = 100000018521

    const meta = new grpc.Metadata()
    meta.set('processId', JSON.stringify(processId))

    let result
    try {
        const params = {
            userId,
            orderCode
        }
        result = await service.data(params, meta)
    } catch (e) {
        apiDataOrderSpan
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
        apiDataOrderSpan.finish()
    }

    return res
        .status(200)
        .json({
            status: 200,
            code: null,
            message: 'Order data',
            data: result.order,
        })
}