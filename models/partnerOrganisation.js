module.exports = (sequelize, dataType) => {
  const partnerOrganisaton = sequelize.define("partnerorganisaton", {
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
  return partnerOrganisaton;
};
