const express = require("express");
const models = require("./models/models");
const {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require("./controllers/generalController");

const router = express.Router();

// Middleware to get the correct model based on the URL path
router.use("/:model", (req, res, next) => {
  const modelName = req.params.model;
  const model = models[modelName.toLowerCase()];

  if (!model) {
    return res.status(404).json({ error: `Model '${modelName}' not found.` });
  }

  req.model = model;
  next();
});

const modelAction = (action) => (req, res) => {
    action(req.model)(req, res);
};

router.post("/:model", modelAction(createRecord)); 
router.get("/:model", modelAction(getRecords)); 
router.get("/:model/:id", modelAction(getRecordById)); 
router.put("/:model/:id", modelAction(updateRecord)); 
router.delete("/:model/:id", modelAction(deleteRecord)); 

module.exports = router;
