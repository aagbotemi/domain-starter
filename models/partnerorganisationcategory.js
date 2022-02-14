module.exports = (sequelize, dataType) => {
    const partnerorganisationcategory = sequelize.define("partnerorganisationcategory", {
        partnerorganisationId: {
            type: dataType.INTEGER,
            references: {
              model: 'partnerorgainsation',
              key: 'id',
              as: 'partnerorganisationId'
            }
          },
          categoryId: {
            type: dataType.INTEGER,
            references: {
              model: 'category',
              key: 'id',
              as: 'categoryId'
            }
          },
    });
    return partnerorganisationcategory;
  };