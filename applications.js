const express = require('express');

const { fetchData } = require('./db');

const router = express.Router();

/* todo útfæra */

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function data(req, res) {
  const rows = await fetchData();

  return res.render('applications', { rows, title: 'Stjórnsíða' });
}

async function download(req, res) {
  const rows = await fetchData();

  const header = 'date;name;email;phone;presentation;job;processed';
  const body = rows.map(row => `${row.created};${row.name};${row.email};${row.phone};${row.presentation};${row.job};${row.processed}`).join('\n');

  res.type('text/csv');
  res.send([header, body].join('\n'));
}

router.get('/', data, catchErrors(data));
router.get('/download', download, catchErrors(download));

module.exports = router;
