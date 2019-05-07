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
			res.status(500).json({ error: 'The zoos information could not be retrieved.' });
		});
});

router.get('/:id', (req, res) => {
	db('zoos')
		.where({ id: req.params.id })
		.first()
		.then((zoo) => {
			console.log(zoo);
			if (zoo) {
				res.status(200).json(zoo);
			} else {
				res.status(404).json({ error: 'The zoo with the specified ID does not exist.' });
			}
		})
		.catch((err) => {
			res.status(500).json({ error: 'The zoo information could not be retrieved.' });
		});
});

router.post('/', (req, res) => {
	if (!req.body.name) {
		res.status(400).json({ error: 'Please provide a name for a new zoo' });
	} else {
		db('zoos')
			.insert(req.body, 'id')
			.then((ids) => {
				// db('zoos')
				// 	.where({ id: ids[0] })
				// 	.first()
				// 	.then((zoo) => {
				// 		res.status(200).json(zoo);
				// 	})
				// 	.catch((err) => {
				// 		res.status(500).json(err);
				// 	});
				res.status(201).json(ids);
			})
			.catch((err) => {
				res.status(500).json({ error: 'There was an error while saving the zoo to the database' });
			});
	}
});

router.put('/:id', (req, res) => {
	db('zoos')
		.where({ id: req.params.id })
		.update(req.body)
		.then((numOUpdated) => {
			console.log(numOUpdated);
			if (numOUpdated > 0) {
				db('zoos')
					.where({ id: req.params.id })
					.first()
					.then((zoo) => {
						res.status(200).json(zoo);
					})
					.catch((err) => {
						res.status(404).json({ error: 'The zoo with the specified ID does not exist.' });
					});
			} else {
				res.status(404).json({ message: 'It was an error while updating your Zoo, please try again' });
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.delete('/:id', (req, res) => {
	db('zoos')
		.where({ id: req.params.id })
		.del()
		.then((numOfDeleted) => {
			if (numOfDeleted > 0) {
				res.status(204).end();
			} else {
				res.status(404).json({ error: 'The zoo with the specified ID does not exist.' });
			}
		})
		.catch((err) => {
			res.status(500).json({ error: 'It was an error while deleting your Zoo, please try again' });
		});
});

module.exports = router;
