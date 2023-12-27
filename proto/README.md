to run Grpc on any of the .proto files all we have to do is to run the following command

```console
protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/auth.proto
```

this will generate us a .ts file that we can use in our application
