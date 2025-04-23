const { Thought, User } = require('../models');

module.exports = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // get a single thought by _id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) return res.status(404).json({ message: 'No thought found' });
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // post a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      await User.findByIdAndUpdate(
        req.body.userId,
        { $push: { thoughts: thought._id } },
        { new: true }
      );
      res.json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // put to update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        { new: true, runValidators: true }
      );
      if (!thought) return res.status(404).json({ message: 'No thought found' });
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
      if (!thought) return res.status(404).json({ message: 'No thought found' });
      res.json({ message: 'Thought deleted' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // post a reaction to a thought
  async addReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $push: { reactions: req.body } },
        { new: true, runValidators: true }
      );
      if (!thought) return res.status(404).json({ message: 'No thought found' });
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete a reaction
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      if (!thought) return res.status(404).json({ message: 'No thought found' });
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};