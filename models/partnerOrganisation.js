module.exports = (sequelize, dataType) => {
  const partnerOrganisation = sequelize.define("partnerorganisation", {
    organisationName: {
      type: dataType.STRING,
      unique: true,
      allowNull: false,
    },
    address: {
      type: dataType.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: dataType.STRING,
    },
    emailAddress: {
      type: dataType.STRING,
      unique: true,
      allowNull: false,
    },
  });
  return partnerOrganisation;
};
