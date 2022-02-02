module.exports = (sequelize, dataType) => {
  const states = sequelize.define("state", {
    stateName: {
      type: dataType.STRING,
    },
  });
  return states;
};
