const Router = require('express').Router();
const ctrlStock = require('../controllers/stock.controller');

Router.get("/getAllStock",ctrlStock.getAllStock);
Router.post("/getStockByID",ctrlStock.getStockById);
Router.put("/checkOut",ctrlStock.checkOutStock);

module.exports = Router