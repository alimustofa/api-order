'use strict'

const Controller = (service) => {
    async function list(req, res) {
        const page = req.query.page || 1
        const size = req.query.size || 3

        const result = await service.list({ page, size })
    
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