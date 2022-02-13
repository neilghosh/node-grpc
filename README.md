## GRPC Node Demo

### Test Locally
#### start server 
```
node ./pingserver/ping-server.js &
```

### run client 
```
node ./pingserver/ping-client.js
```
output 
```
Response: Thank you for Namaste
```

### Run in docker

```
docker build . -t gcr.io/$GCP_PROJECT/grpc-ping:latest
docker run -d -p 50051:50051 -e PORT=50051 gcr.io/$GCP_PROJECT/grpc-ping          
```

install [grpcurl-tools](https://www.npmjs.com/package/grpcurl-tools)

```
grpcurl \                                                                                        
    -plaintext -proto protos/ping.proto \
    -d '{"greetings": "Hello"}' \
    localhost:50051 \
    ping.PingServer.doPing
```

### Run in Cloud Run
```
gcloud auth login 
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/grpc-ping
cloud auth configure-docker
docker run -d -p 50051:50051 -e PORT=50051 gcr.io/$GOOGLE_CLOUD_PROJECT/grpc-ping
gcloud run deploy ping-upstream --image gcr.io/$GOOGLE_CLOUD_PROJECT/grpc-ping
```
```
grpcurl \                                                                                        
    -proto protos/ping.proto \           
    -d '{"greetings": "Hello"}' \
    ping-upstream-b3zzuedwgq-uc.a.run.app:443 \
    ping.PingServer.doPing
```

## Deploy endpoint 
```
pip install grpcio
pip install grpcio-tools
```

### Generate the API Descriptors 

```
python3 -m grpc_tools.protoc \
    --include_imports \
    --include_source_info \
    --proto_path=./protos \
    --descriptor_set_out=api_descriptor.pb \
    --python_out=generated_pb2 \
    --grpc_python_out=generated_pb2 \
    ping.proto
```

### Reserve the Gateway 

```
gcloud run deploy api-service \
    --image="gcr.io/cloudrun/hello" \
    --allow-unauthenticated \
    --platform managed \
    --project=demoneil
```

### Update the image in Gateway

```
chmod +x gcloud_build_image

./gcloud_build_image -s api-service-b3zzuedwgq-uc.a.run.app -c 2022-02-13r0 -p demoneil

gcloud run deploy api-service \
    --image="gcr.io/demoneil/endpoints-runtime-serverless:2.34.0-api-service-b3zzuedwgq-uc.a.run.app-2022-02-13r0" \
    --allow-unauthenticated \
    --platform managed \
    --project=demoneil
```

### test gateway

node_modules/.bin/grpcurl grpcurl -proto protos/ping.proto -d '{"greetings": "Hello"}' api-service-b3zzuedwgq-uc.a.run.app:443 ping.PingServer.doPing
