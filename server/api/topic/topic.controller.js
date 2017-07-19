
const _ = require('lodash')
const Topic = require('./topic.model')
const Question = require('../question/question.model')

// Add a question to this topic
exports.addQuestion = function (req, res) {
  console.log('in add question in server')
  console.log(req.body)
  req.body.topic = req.params.id // is this necessary?

   // express's body parser middleware populates body for me

  /* var query = Topic.findById(req.params.id);

  query.exec(function (err, topic){
    if (err) { return handleError(err); }
    if (!topic) { return next(new Error("can't find post")); }

    question.topic = topic;
    //req.post = post;
    //return next();
  });
*/

  // question.topic = req.topic; // this is the problem line cuz there's no topic

  // if question already exists, only add it to topic
  Question.findById(req.body._id, (err, question) => {
    if (err) { return handleError(res, err) }
    if (question) {
      Topic.findById(req.params.id, (err, topic) => {
        if (err) { return handleError(res, err) }
        if (!topic) { return res.send(404) }

        topic.questions.push(question)

        topic.save((err, topic) => {
          if (err) { return handleError(err) }
          return res.json(question)
        })
      })
    } else { // if not, create the new question
      question = new Question(req.body)
      question.save((err, question) => {
        if (err) { return handleError(res, err) }
        console.log('in save question success func')
        Topic.findById(req.params.id, (err, topic) => {
          if (err) { return handleError(res, err) }
          if (!topic) { return res.send(404) }

          topic.questions.push(question)

          topic.save((err, topic) => {
            if (err) { return handleError(err) }
            return res.json(question)
          })
        })
      })
    }
  })
}

exports.deleteQuestion = function (req, res) {
  console.log('in delete q server')
  const question = req.body
  console.log(question)
  Topic.findById(req.params.id, (err, topic) => {
    if (err) { return handleError(res, err) }
    if (!topic) { return res.send(404) }

    // var doc = topic.questions.id(question._id).remove();
    topic.questions.pull(question._id)
    topic.save((err) => {
      if (err) return handleError(err)
      console.log('the sub-doc was removed')
    })
  })
}

// Get list of topics
exports.index = function (req, res) {
  // Topic.find(function (err, topics) {
    // if(err) { return handleError(res, err); }
    /* topics.forEach(function(ea) {
      ea.populate('questions', function(err, topic) {
        if (err) { return handlError(res, err) }
        // what do i do with the topic?
        console.log('in populate success func');
        console.log(topic.questions);
      });
      //console.log('in foreach');
      //console.log(ea);
    });
*/
  Topic.find().populate('topic.questions').exec(function (err, topics) {
    if (err) {
      res.status(500)
      return
    }
    res.status(200).json(topics)
  })
}

// Get a single topic
exports.show = function (req, res) {
  // Topic.findById(req.params.id, function (err, topic) {
  Topic.findOne({ title: req.params.title }, (err, topic) => {
    if (err) { return handleError(res, err) }
    if (!topic) { return res.send(404) }

    topic.populate('questions', (err, topic) => {
      if (err) { return handleError(res, err) }
      return res.json(topic)
    })
  })
}

// Creates a new topic in the DB.
exports.create = function (req, res) {
  Topic.create(req.body, (err, topic) => {
    if (err) { return handleError(res, err) }
    return res.status(201).json(topic)
  })
}

// Updates an existing topic in the DB.
exports.update = function (req, res) {
  console.log('in update')
  if (req.body._id) { delete req.body._id }
  Topic.findById(req.params.id, (err, topic) => {
    console.log('in update found topic by id')
    if (err) { return handleError(res, err) }
    if (!topic) { return res.send(404) }

    topic.questions = req.body.questions // without this, reordering doesn't work (found in question.controller)

    const updated = _.merge(topic, req.body)
    updated.save((err) => {
      // console.log(updated);
      if (err) { return handleError(res, err) }
      console.log('updated topic now about to populate qs')
      topic.populate('questions', (err, topic) => {
        if (err) {
          console.log('error populating questions of updated topic')
          return handleError(res, err)
        }
        console.log('looks like populate was successful?')
        console.log(topic)
        return res.status(200).json(topic)
      })
    })
  })
}

// Deletes a topic from the DB.
exports.destroy = function (req, res) {
  Topic.findById(req.params.id, (err, topic) => {
    if (err) { return handleError(res, err) }
    if (!topic) { return res.send(404) }
    topic.remove((err) => {
      if (err) { return handleError(res, err) }
      return res.send(204)
    })
  })
}

function handleError (res, err) {
  return res.status(500).send(err)
}
