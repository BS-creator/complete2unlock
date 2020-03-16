docker stop complete2unlock
docker rm complete2unlock
docker run -d -p 80:8080 -p 443:8443 --link mongo:mongo -e MONGODB_URI=mongodb://mongo/complete2unlock -e PORT=8080 -e SSL_PORT=8443 \
        -e BASE_URL=https://complete2unlock.com \
        -e NODE_ENV=production \
        -e PAYPAL_MODE=live \
        -e PAYPAL_ID=AddeChj0zZzvjIPEyjW-vye8oku8NMlWJTgv5MLJxOnrjnhqIbKBFiSw1MDUx7TVDK8cps0bqTl7zx-4 \
        -e PAYPAL_SECRET=EGk11z86XmmJI6uRsEhRe-qfp5YUqrJuVRvcvIi9rbOAm53LMgFLAEzP48LbvcoyNCsBpllSM447Hbge \
        --name complete2unlock --restart always \
        -v /data/ssl/cf.crt:/tls_crt -v /data/ssl/cf.key:/tls_key complete2unlock
