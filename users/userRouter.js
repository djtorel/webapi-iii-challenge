const express = require('express');

const userDb = require('./userDb');
const postDb = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res, next) => {
  userDb
    .insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(next);
});

router.post('/:id/posts', [validateUserId, validatePost], (req, res, next) => {
  postDb
    .insert({ ...req.body, user_id: Number(req.params.id) })
    .then(post => res.status(201).json(post))
    .catch(next);
});

router.get('/', (req, res, next) => {
  userDb
    .get()
    .then(users => res.status(200).json(users))
    .catch(next);
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  postDb
    .get()
    .then(posts =>
      res
        .status(200)
        .json(posts.filter(post => post.user_id === Number(req.params.id)))
    );
});

router.delete('/:id', validateUserId, (req, res, next) => {
  userDb
    .remove(req.params.id)
    .then(() => res.status(200).json(req.user))
    .catch(next);
});

router.put('/:id', [validateUserId, validateUser], (req, res, next) => {
  userDb
    .update(req.params.id, req.body)
    .then(async () => res.status(200).json(await userDb.getById(req.params.id)))
    .catch(next);
});

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

function validatePost(req, res, next) {
  if (
    Object.entries(req.body).length === 0 &&
    req.body.constructor === Object
  ) {
    next(error(400, 'missing post data'));
  }
  const { text } = req.body;
  text && text.length > 0
    ? next()
    : next(error(400, 'missing required text field'));
}

module.exports = router;
