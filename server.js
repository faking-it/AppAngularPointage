const express = require('express');

const app = express();

app.use(express.static('./dist/AppAngularPointage'));

app.get('/*', function(req, res) {
    res.sendFile('index.html', {root: './dist/AppAngularPointage/'}
  );
});

app.listen(process.env.PORT || 8080);