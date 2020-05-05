'use strict'

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');


const Client = () => {
    const protoPath = __dirname + '/proto/product.proto'
    const packageDefinition = protoLoader.loadSync(protoPath);
    const productProto = grpc.loadPackageDefinition(packageDefinition);
    
    const ProductClient = productProto.ProductService;

    return new ProductClient('localhost:50052', grpc.credentials.createInsecure());
}

module.exports = Client