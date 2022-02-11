var PROTO_PATH = __dirname + '/../protos/ping.proto';

var parseArgs = require('minimist');
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

function main() {
  var argv = parseArgs(process.argv.slice(2), {
    string: 'target'
  });
  var target;
  if (argv.target) {
    target = argv.target;
  } else {
    target = 'localhost:50051';
  }
  var client = new ping_proto.PingServer(target,
                                       grpc.credentials.createInsecure());
  var user;
  if (argv._.length > 0) {
    user = argv._[0]; 
  } else {
    user = 'Namaste';
  }
  client.doPing({greetings: user}, function(err, response) {
    console.log('Response:', response.acknowledgement);
  });
}

main();