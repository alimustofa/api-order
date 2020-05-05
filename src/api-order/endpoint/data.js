'use strict'

const grpc = require('grpc')
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing')
const tracer = require('../../../utils/tracer')

/**
 * @api {get} /order/:orderCode GetOrder
 * @apiName GetOrderData
 * @apiGroup Order
 * @apiVersion 1.0.0
 * 
 * @apiDescription 
 * Get order data
 *
 * @apiParam {String} orderCode Order Code (9001-00930094).
 *
 * @apiSuccess {Number} status Response status.
 * @apiSuccess {String} code  Response code.
 * @apiSuccess {String} message  Message of the endpoint.
 * @apiSuccess {Object[]} data  Data of the response.
 * @apiSuccess {Number} data.id  ID of order.
 * @apiSuccess {String} data.orderCode  OrderCode of order.
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "status": 200,
 *       "code": null,
 *       "message": "Order Data",
 *       "data": [
 *          {
 *              "id": 1000000001,
 *              "orderCode": "8001-00000001"
 *          }
 *       ]
 *     }
 * 
 * @apiError UserNotFound The <code>id</code> of the User was not found.
 * 
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "error": "UserNotFound"
 *     }
 */
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
        console.log(e.code)
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
        .json(result)
}