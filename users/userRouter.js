const express = require('express');

const userDb = require('./userDb');

const router = express.Router();

router.post('/', validateUser, (req, res, next) => {
  userDb
    .insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(next);
});

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

router.delete('/:id', validateUserId, (req, res, next) => {
  userDb
    .remove(req.params.id)
    .then(() => res.status(200).json(req.user))
    .catch(next);
});

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
        next(error(400, 'invalid user id'));
      }
    })
    .catch(next);
}

function validateUser(req, res, next) {
  if (
    Object.entries(req.body).length === 0 &&
    req.body.constructor === Object
  ) {
    next(error(400, 'missing user data'));
  }
  const { name } = req.body;
  name && name.length > 0
    ? next()
    : next(error(400, 'missing required name field'));
}

function validatePost(req, res, next) {}

module.exports = router;
