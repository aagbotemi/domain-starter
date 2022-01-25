module.exports = (sequelize, dataType) => {
    const evicted = sequelize.define("evicted", {
      type: {
        type: dataType.STRING,
      },
      reason: {
        type: dataType.STRING,
      },
      dateEvicted: {
        type: dataType.DATE,
      },
    });
    return evicted;
  };