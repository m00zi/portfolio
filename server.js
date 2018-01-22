const express = require('express');
const compression = require('compression');
const path = require('path');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const ms = require('ms');
const helmet = require('helmet');

const projectData = require('./data/project.data');
const pingController = require('./ping/ping.controller');

const app = express();
app.use(bodyParser.json())
app.use(compression());
app.use(helmet());

let port = process.env.PORT || 4200;

const keepAwake = false;
const pingPrimary = false;
const pingSecondary = false;

app.use(express.static(path.join(__dirname, 'dist'), {maxAge: ms('1y')}));

app.get('/data/projects', (req, res) => {
  res.status(200).send(projectData);
});

app.post('/ping', (req, res) => {
  const {type} = req.body;

  if (type === 'primary' && pingPrimary) {
    pingController.pingPrimaryProjects();
    res.status(200).send('Primary Projects Promptly Pinged');
  } else if (type === 'secondary' && pingSecondary) {
    pingController.pingSecondaryProjects();
    res.status(200).send('Secondary Projects Promptly Pinged');
  } else {
    res.status(200).send('Ping service is switched off');
  }
});

app.get('/Alistair-Willis-CV', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'Alistair-Willis-CV.pdf'));
})

app.get('/*', (req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  console.log(chalk.green('API Running on Port ' + port));
});

if (keepAwake) {
  setInterval(function() {
    pingController.pingSelf();
  }, ms('1hr'));
}
