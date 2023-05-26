const Router = require('express').Router();

Router.use("/stock",require("./stock.rountes"));

module.exports = Router