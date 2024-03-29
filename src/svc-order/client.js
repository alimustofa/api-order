'use strict'

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');


const Client = () => {
    const protoPath = __dirname + '/proto/v1/order.proto'
    const protoOpts = {
        longs: Number,
        keepCase: true,
        defaults: true,
        oneofs: true,
        arrays: true,
    }
    const packageDefinition = protoLoader.loadSync(protoPath, protoOpts);
    const orderProto = grpc.loadPackageDefinition(packageDefinition);
    
    const OrderClient = orderProto.OrderService;

    return new OrderClient('localhost:50053', grpc.credentials.createInsecure());
}

module.exports = Client