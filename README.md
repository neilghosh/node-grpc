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
docker build -t gcr.io/$GCP_PROJECT/grpc-ping:latest
docker run -d -p 50051:50051 -e PORT=50051 gcr.io/$GCP_PROJECT/grpc-ping          
```

```
grpcurl \                                                                                        
    -plaintext -proto protos/ping.proto \
    -d '{"greetings": Hello""}' \
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