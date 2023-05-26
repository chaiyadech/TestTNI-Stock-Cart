const conn = require("../configs/db.config");

exports.getAllStock = async (req, res) => {
  var sql = "select * from testtni.stock";
  await conn.query(sql, function (err, result) {
    if (err)
      throw (err) => {
        return res.status(500).send("error :" + err);
      };
    if (result.length == 0) {
      return res.send({ stat: "error", message: "Data Not found." });
    }
    res.send({ stat: "success", mystock: result });
  });
};

exports.getStockById = async (req, res) => {
  console.log(req.body);
  const { ID, productName } = req.body;

  var sql = `select * from testtni.stock where id = ${ID}`;
  await conn.query(sql, function (err, result) {
    if (err)
      throw (err) => {
        return res.status(500).send("error :" + err);
      };
    if (result.length == 0) {
      return res.send({ stat: "error", message: "Data Not found." });
    }
    res.send({ stat: "success", mystock: result });
  });
};

exports.checkOutStock = async (req, res) => {
  const param = req.body;
  console.log(param);
  var error = "";
  for (let item of param) {
    const { productID, productName, productAmount } = item;
    let sql = `UPDATE testtni.stock SET productAmount = '${productAmount}'WHERE ID = ${productID} and productName = '${productName}'`;

    // console.log(item);

    await conn.query(sql, function (result, err) {
      if (err) {
        error += err;
      }
    });
  }
  if (error != "") {
    return res.status(500).send({ stat: "error", massage: error });
  } else {
    return res.send({ stat: "success", massege: "success" });
  }
};
