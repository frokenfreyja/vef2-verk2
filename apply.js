const xss = require('xss');
const express = require('express');

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

/* todo útfæra */
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const { saveToDb, fetchPresentation } = require('./db');

const router = express.Router();

const applyValidation = [
  check('name')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),

  check('email')
    .isLength({ min: 1 })
    .withMessage('Netfang má ekki vera tómt'),

  check('email')
    .isEmail()
    .withMessage('Netfang verður að vera netfang'),

  check('phone')
    .isLength({ min: 7, max: 8 }).withMessage('Símanúmer verður að vera sjö tölustafir'),
  check('phone')
    .matches(/^[1-9]{3}[ -]?[0-9]{4}$/).withMessage('Símanúmer verður að vera símanúmer'),

  check('presentation').isLength({ min: 100 }).withMessage('Kynning verður að vera að minnsta kosti 100 stafir'),

  check('job').isLength({ min: 1 }).withMessage('Velja verður starf'),

  sanitize('name').trim(),
  sanitize('phone').trim(),

];

function apply(req, res) {
  const data = {};
  const validation = validationResult(req);
  const errors = validation.array();
  const text = req.params.presentation;
  console.log(text);
  res.render('apply', { errors, data, text, title: 'Atvinnuumsókn' });
}

async function applyPost(req, res) {
  // fá öll gögn úr formi
  const {
    body: {
      name = '',
      email = '',
      phone = '',
      presentation = '',
      job = '',
    } = {},
  } = req;

  // öll gögn hreinsuð úr formi
  const data = {
    name: xss(name),
    email: xss(email),
    phone: xss(phone),
    presentation: xss(presentation),
    job: xss(job),
  };

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errors = validation.array();
    const text = req.params.presentation;
    return res.render('apply', { errors, data, text, title: 'Atvinnuumsókn' });
  }

  await saveToDb(data);

  return res.redirect('/thanks');
}

function thanks(req, res) {
  return res.render('thanks', { title: 'Umsókn móttekin', undertitle: 'Takk fyrir. Við höfum samband.' });
}

router.get('/', apply);
router.post('/', applyValidation, catchErrors(applyPost));
router.get('/thanks', thanks);

module.exports = router;
