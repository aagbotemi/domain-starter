module.exports = (sequelize, dataType) => {
  const geopoliticalZones = sequelize.define("geopoliticalZones", {
    geoPoliticalZoneName: {
      type: dataType.STRING,
    },
    geoPoliticalZoneDescription: {
      type: dataType.STRING,
    },
  });
  return geopoliticalZones;
};
