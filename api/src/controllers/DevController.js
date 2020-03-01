const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if(!dev) {
      const response = await axios.get(`https://api.github.com/users/${github_username}`);
  
      const { name = login, avatar_url, bio } = response.data;
    
      const techsArray = parseStringAsArray(techs);
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      })
    }
    return res.json(dev);
  },

  async update(req, res) {
    const { techs, latitude, longitude, bio, avatar_url, name } = req.body;
    const { _id } = req.params;

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    }

    const techsArray = parseStringAsArray(techs);

    await Dev.updateOne({ _id }, {
      techs: techsArray,
      location,
      bio,
      avatar_url,
      name
    })
    
    const dev = await Dev.findById(_id);
    return res.json(dev)
  },
  
  async destroy(req, res) {
    const { _id } = req.params;

    const dev = await Dev.findById(_id);

    if (!dev) {
      return res.status(404).json({ erro: 'Dev not found to delete' });
    }

    await Dev.findByIdAndDelete(_id);
    return res.status(200).json({});

  },
}