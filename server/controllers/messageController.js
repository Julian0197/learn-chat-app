const Messages = require('../model/messageModel');

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.json({ msg: 'Message sent successfully' });
    } else {
      return res.json({ msg: 'Fail to send message' });
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from.toString(),
        message: msg.message.text,
      };
    });
    return res.json(projectMessages);
  } catch (ex) {
    next(ex);
  }
};
