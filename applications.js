const express = require('express');

const { fetchData, removeFromDb, processApplication, updateTime } = require('./db'); /* eslint-disable-line */


const router = express.Router();

/* todo útfæra */

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function data(req, res) {
  const rows = await fetchData();

  return res.render('applications', { rows, title: 'Atvinnuumsóknir' });
}

/* Uppfærum tímann þegar ýtt er á "Vinna umsókn" og breytum processed í true */
async function process(req, res) {
  await updateTime(req.params.id);
  await processApplication(req.params.id);

  return res.redirect('/applications');
}

/* Eyða umsókn úr gagnagrunni */
async function remove(req, res) {
  await removeFromDb(req.params.id);

  return res.redirect('/applications');
}

router.get('/', data, catchErrors(data));
router.post('/process/:id', process, catchErrors(process));
router.post('/remove/:id', remove, catchErrors(remove));

module.exports = router;
