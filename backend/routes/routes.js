var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
require("dotenv").config();
const Controller = require('../controllers/users.controllers');
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.post('/login', Controller.login)
router.post('/loanRequest', Controller.createLoanRequest)
router.post("/getUserLoans",Controller.getUserLoans)
router.post("/payInstallment",Controller.payInstallment)
module.exports.routes = router;
