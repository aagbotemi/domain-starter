module.exports = (sequelize, dataType) => {
    const trainingBatch = sequelize.define("trainingBatch", {
      batchName: {
        type: dataType.STRING,
        allowNull: false
      },
      batchDescriptiom: {
        type: dataType.STRING,
      },
     
    });
    return trainingBatch;
  };
  