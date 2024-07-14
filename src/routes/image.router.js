const express = require("express");
const router = express.Router();
const handleFileUpload = require("../utils/storageFiles");

router.post("/", handleFileUpload, (_, res) => res.status(201).json({ status: res.statusCode, mensaje: "File uploaded successfully" }));

module.exports = router;