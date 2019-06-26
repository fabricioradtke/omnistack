const Post = require('../models/Post');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = {
	async index(req, res) {
		const posts = await Post.find().sort('-createdAt');

		return res.json(posts);
	},

	async add(req, res) {
		console.log(req.file);

		const { author, place, description, hashtags } = req.body;
		const { filename } = req.file;

		const [name] = filename.split('.', -1);
		const image = `${name}.jpg`;

		await sharp(req.file.path)
			.resize(500)
			.jpeg({quality: 70})
			.toFile(path.resolve(req.file.destination, 'resized', image));

		fs.unlinkSync(req.file.path);

		const post = await Post.create({
			author, 
			place, 
			description, 
			hashtags, 
			image
		});

		req.io.emit('post', post);

		return res.json(post);
	}
};
