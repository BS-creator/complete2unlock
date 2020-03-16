cd complete2unlock
rm package-lock.json
git pull
npm install
gulp build
docker build -t complete2unlock .
