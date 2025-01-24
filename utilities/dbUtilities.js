async function findRecordByValue(model, value, transaction) {
  if (transaction) {
    return await model.findOne({
      where: { ...value },
      transaction: transaction,
    });
  }
  return await model.findOne({ where: { ...value } });
}

async function findAllRecords(model, query) {
  if (query) {
    return await model.findAll({ where: { ...query } });
  }
  return await model.findAll();
}

async function createRecord(model, data, transaction) {
  try {
    if (transaction) {
      return model.create(data, { transaction: transaction });
    }
    return model.create(data);
  } catch (error) {
    throw error;
  }
}

/**
 * Updates a single record in the given model.
 *
 * @param {Sequelize.Model} model
 * @param {Object} updateData
 * @param {number} id
 * @param {Sequelize.Transaction} [transaction]
 * @returns {Promise<number>} The number of rows updated.
 */
async function updateRecord(model, updateData, id, transaction) {
  if (transaction) {
    const [updatedRowsCount] = await model.update(updateData, {
      where: {
        id,
      },
      transaction: transaction,
    });
    return updatedRowsCount;
  }
  const [updatedRowsCount] = await model.update(updateData, {
    where: {
      id,
    },
  });
  return updatedRowsCount;
}

async function deleteRecord(model, id, transaction) {
  if (transaction) {
    return await model.destroy({ where: { id }, transaction: transaction });
  }
  return await model.destroy({ where: { id } });
}

module.exports = {
  findRecordByValue,
  findAllRecords,
  createRecord,
  updateRecord,
  deleteRecord,
};
