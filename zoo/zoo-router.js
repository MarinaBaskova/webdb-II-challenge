const knex = require('knex');
const router = require('express').Router();

const knexConfig = {
	client: 'sqlite3',
	connection: {
		filename: './data/lambda.sqlite3'
	},
	useNullAsDefault: true
};
const db = knex(knexConfig);

router.get('/', (req, res) => {
	db('zoos')
		.then((zoos) => {
			res.status(200).json(zoos);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.post('/', (req, res) => {
	if (!req.body.name) {
		res.status(400).json({ error: 'Please provide a name for a new zoo' });
	} else {
		db('zoos')
			.insert(req.body, 'id')
			.then((ids) => {
				db('zoos')
					.where({ id: ids[0] })
					.first()
					.then((zoo) => {
						res.status(200).json(zoo);
					})
					.catch((err) => {
						res.status(500).json(err);
					});
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	}
});

module.exports = router;
