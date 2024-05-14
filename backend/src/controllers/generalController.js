const { Op } = require('sequelize');

const getModelAttributeTypes = (Model) => {
  const attributes = Model.rawAttributes;
  const attributeTypes = {};

  for (const [key, value] of Object.entries(attributes)) {
    let typeString = value.type.toString();
    if (typeString === 'TINYINT(1)') {
      typeString = 'BOOLEAN';
    } else if (typeString.includes('CHAR')) {
      typeString = 'TEXT';
    }

    attributeTypes[key] = {
      type: typeString,
      lookup: value.values && value.type._length == 101 ? true : false,
      dynamicLookup: value.values && value.type._length == 103 ? true : false,
      lookupValues: value.values ? value.values : null,
      allowNull: value.allowNull !== undefined ? value.allowNull : true,
      primaryKey: value.primaryKey || false,
      autoIncrement: value.autoIncrement || false,
      unique: value.unique || false,
      validate: value.validate,
    };
  }

  return attributeTypes;
};

const createRecord = (Model) => async (req, res) => {
  try {
    const record = await Model.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all records
const getRecords = (Model) => async (req, res) => {
  const { field, fieldName, watchedField, watchedFieldValue, operator } = req.query;
  const queryOptions = {};
  
  try {  

    if (fieldName) {
      queryOptions.attributes = [fieldName];
    }

    if (fieldName && watchedField && operator && watchedFieldValue !== undefined) {
      queryOptions.attributes = [fieldName];

      let sequelizeOperator;
      switch (operator) {
        case 'eq':
          sequelizeOperator = Op.eq;
          break;
        case 'ne':
          sequelizeOperator = Op.ne;
          break;
        case 'gt':
          sequelizeOperator = Op.gt;
          break;
        case 'gte':
          sequelizeOperator = Op.gte;
          break;
        case 'lt':
          sequelizeOperator = Op.lt;
          break;
        case 'lte':
          sequelizeOperator = Op.lte;
          break;
        case 'like':
          sequelizeOperator = Op.like;
          break;
        default:
          return res.status(400).json({ error: "Invalid operator" });
      }

      queryOptions.where = {
        [watchedField]: {
          [sequelizeOperator]: watchedFieldValue,
        },
      };
    }

    const records = await Model.findAll(queryOptions);

    const attributeTypes = getModelAttributeTypes(Model);


    res.json({
      attributeTypes: attributeTypes,
      visibility: Model.visibilityConditions(),
      data: records,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Function to get a specific record by ID
const getRecordById = (Model) => async (req, res) => {
  try {
    const record = await Model.findByPk(req.params.id);
    if (record) {
      res.json(record);
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a user
const updateRecord = (Model) => async (req, res) => {
  try {
    const record = await Model.findByPk(req.params.id);
    if (record) {
      await record.update(req.body);
      res.json(record);
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user
const deleteRecord = (Model) => async (req, res) => {
  try {
    const record = await Model.findByPk(req.params.id);
    if (record) {
      await record.destroy();
      res.json({ message: "Record deleted" });
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
