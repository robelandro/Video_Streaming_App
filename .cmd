openssl genpkey -algorithm RSA -out jwtRS256.key
openssl rsa -pubout -in jwtRS256.key -out jwtRS256.key.pub