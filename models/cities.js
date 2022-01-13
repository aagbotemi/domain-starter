module.exports = (sequelize, dataType) => {
  const cities = sequelize.define("cities", {
    cityName: {
      type: dataType.STRING,
    },
  });
  return cities;
};
