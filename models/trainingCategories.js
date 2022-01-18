module.exports = (sequelize, dataType) => {
    const trainingCategories = sequelize.define("category", {
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
  