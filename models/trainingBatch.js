module.exports = (sequelize, dataType) => {
    const trainingBatch = sequelize.define("trainingBatch", {
      batchName: {
        type: dataType.STRING,
        allowNull: false
      },
      batchDescriptiom: {
        type: dataType.STRING,
      },
      startDate: {
        type: dataType.DATE,
      },
      endDate: {
        type: dataType.DATE,
      },
     
    });
    return trainingBatch;
  };
  