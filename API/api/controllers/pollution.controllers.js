const db = require("../models");
const Pollution = db.pollution;

exports.get = (req, res) => {

	Pollution.findAll()
		.then(data => { res.send(data); })
		.catch(err => {
			res.status(400).send({
				message: err.message
			});
		});

};

exports.findOne = (req, res) => {
	const id = req.params.id;
	Pollution.findByPk(id)
		.then(data => {
			if (!data) {
				return res.status(404).send({
					message: "Pollution not found"
				});
			}
			res.send(data);
		})
		.catch(err => {
			res.status(400).send({
				message: err.message
			});
		});
};

exports.create = (req, res) => {
	// Validate request
	// `titre` is required by the model
	if (!req.body.titre) {
		res.status(400).send({
			message: "Content can not be empty!"
		});
		return;
	}

	// Map incoming body to model fields
	const pollution = {
		titre: req.body.titre,
		lieu: req.body.lieu,
		date_observation: req.body.date_observation,
		type_pollution: req.body.type_pollution,
		description: req.body.description,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		photo_url: req.body.photo_url
	};

	Pollution.create(pollution)
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while creating the Pollution."
			});
		});
};

exports.update = (req, res) => {
	const id = req.params.id;
	Pollution.update(req.body, {
		where: { id: id }
	})
		.then(num => {
			if (num == 1) {
				res.send({
					message: "Pollution was updated successfully."
				});
			} else {
				res.send({
					message: `Cannot update Pollution with id=${id}. Maybe Pollution was not found or req.body is empty!`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error updating Pollution with id=" + id
			});
		});
};

exports.delete = (req, res) => {
	const id = req.params.id;
	Pollution.destroy({ where: { id: id } })
		.then(num => {
			if (num == 1) {
				res.send({
					message: "Pollution was deleted successfully!"
				});
			} else {
				res.send({
					message: `Cannot delete Pollution with id=${id}. Maybe Pollution was not found!`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Could not delete Pollution with id=" + id
			});
		});
};

