module.exports = (sequelize, dataType) => {
  const employ = sequelize.define("employ", {
    organisationName: {
      type: dataType.STRING,
    },
    organisationAddress: {
      type: dataType.STRING,
    },
    yearEmployed: {
      type: dataType.DATE,
    },
  });
  return employ;
};
