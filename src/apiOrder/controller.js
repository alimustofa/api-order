'use strict'

const grpc = require('grpc')
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing')
const tracer = require('../../utils/tracer')

const Controller = (service) => {
    async function list(req, res) {
        const apiListOrderSpan = tracer.startSpan("list-order")

        const processId = {}
        tracer.inject(apiListOrderSpan, FORMAT_HTTP_HEADERS, processId)

        const page = req.query.page || 1
        const size = req.query.size || 3

        const meta = new grpc.Metadata()
        meta.set('processId', JSON.stringify(processId))

        let result
        try {
            result = await service.list({ page, size }, meta)
        } catch (e) {
            apiListOrderSpan.setTag(Tags.ERROR, true).log({ error: e })
        } finally {
            apiListOrderSpan.finish()
        }
    
        res
            .status(200)
            .json({
                status: 200,
                code: null,
                message: 'Order data',
                data: result,
            })
    }    

    return {
        list
    }
}
    

module.exports = Controller