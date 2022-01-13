module.exports = (sequelize, dataType) => {
  const states = sequelize.define("states", {
    stateName: {
      type: dataType.STRING,
    },
  });
  return states;
};
