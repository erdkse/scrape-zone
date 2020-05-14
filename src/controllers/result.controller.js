const ResultModel = require('../models/result.model');
const searchGoogle = require('./../services/search-google.service');

const DATE_EXPIRING_TIME = 24 * 60 * 60 * 1000;

const ResultController = {};

ResultController.checkResult = async (req, res) => {
  const keywords = req.query.keywords;

  if (!keywords) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  try {
    const result = await ResultModel.findOne({ keywords });

    if (result) {
      const expiringTime =
        new Date(result.proceedOn).getTime() + DATE_EXPIRING_TIME;

      if (expiringTime > Date.now()) {
        return res.status(200).json(result);
      } else {
        const results = await searchGoogle(keywords);
        const updatedResult = await ResultModel.findOneAndUpdate(
          {
            keywords: keywords
          },
          { $set: { results: results, proceedOn: Date.now() } }
        );

        return res.status(200).json(updatedResult);
      }
    }

    const results = await searchGoogle(keywords);
    const createdResult = await ResultModel.create({
      keywords,
      results
    });

    return res.status(200).json(createdResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = ResultController;
