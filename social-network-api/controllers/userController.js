const { User, Thought } = require('../models');

module.exports = {
  // get all users
  async getUsers(req, res) {
    try {
      const users = await User.find().populate('friends').populate('thoughts');
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // get a single user by _id
  async getSingleUser(req, res) {
    try {
      const user = await User.findById(req.params.userId)
        .populate('friends')
        .populate('thoughts');

      if (!user) return res.status(404).json({ message: 'No user found' });

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // post a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // put to update a user by _id
  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true, runValidators: true }
      );
      if (!user) return res.status(404).json({ message: 'No user found' });
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete a user by _id and their thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) return res.status(404).json({ message: 'No user found' });

      // Bonus: Remove all thoughts associated with this user
      await Thought.deleteMany({ _id: { $in: user.thoughts } });

      res.json({ message: 'User and thoughts deleted' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // post to add a friend
  async addFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) return res.status(404).json({ message: 'No user found' });

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete to remove a friend
  async removeFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) return res.status(404).json({ message: 'No user found' });

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};