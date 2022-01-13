module.exports = (sequelize, dataType) => {
    const trainingCategories = sequelize.define("trainingCategories", {
      categoryName: {
        type: dataType.STRING,
        allowNull: false
      },
      categoryDescription: {
        type: dataType.STRING,
      },
    });
    return trainingCategories;
  };
  