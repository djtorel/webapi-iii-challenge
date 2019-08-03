const express = require('express');

const userDb = require('./userDb');

const router = express.Router();

router.post('/', (req, res) => {});

router.post('/:id/posts', (req, res) => {});

router.get('/', (req, res, next) => {
  userDb
    .get()
    .then(users => res.status(200).json(users))
    .catch(next);
});

router.get('/:id', validateUserId, (req, res) => {
  console.log(req.user);
  res.status(200).json(req.user);
});

router.get('/:id/posts', (req, res) => {});

router.delete('/:id', (req, res) => {});

router.put('/:id', (req, res) => {});

//custom middleware

// Error handler
router.use(({ statusCode, message }, req, res, next) => {
  if (!statusCode) statusCode = 500;
  if (!message) message = 'Unknown error';
  res.status(statusCode).json({ message });
  next();
});

// Error helper
const error = (statusCode, message) => ({ statusCode, message });

function validateUserId(req, res, next) {
  const { id } = req.params;
  userDb
    .getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        next({ statusCode: 400, message: 'invalid user id' });
      }
    })
    .catch(next);
}

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

module.exports = router;
