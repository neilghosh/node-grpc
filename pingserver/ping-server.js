var PROTO_PATH = __dirname + '/../protos/ping.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var ping_proto = grpc.loadPackageDefinition(packageDefinition).ping;

function doPing(call, callback) {
  console.log("Request received "+call.request);
  callback(null, {acknowledgement: 'Thank you for ' + call.request.greetings});
}

function main() {
  var server = new grpc.Server();
  server.addService(ping_proto.PingServer.service, {doPing: doPing});


  const port = parseInt(process.env.PORT) || 50052;

  server.bindAsync('0.0.0.0:'+port, grpc.ServerCredentials.createInsecure(), () => {
    console.log("Starting server in port "+port);
    server.start();
  });
}

main();