module.exports = (sequelize, dataType) => {
  const beneficiaries = sequelize.define("beneficiaries", {
    firstName: {
      type: dataType.STRING,
      allowNull: false,
    },
    lastName: {
      type: dataType.STRING,
      allowNull: false,
    },
    middleName: {
      type: dataType.STRING,
    },
    email: {
      type: dataType.STRING,
      unique: true,
      allowNull: false,
    },
    phoneNumber: {
      type: dataType.STRING,
    },
    gender: {
      type: dataType.STRING,
    },
    stateOfOrigin: {
      type: dataType.STRING,
    },
    localGovernmentOfOrigin: {
      type: dataType.STRING,
    },
    stateOfResidence: {
      type: dataType.STRING,
    },
    highestQualification: {
      type: dataType.STRING,
    },
    profileImage: {
      type: dataType.STRING(1234),
    },
    trainingYear: {
      type: dataType.DATE,
    },
    graduationStatus: {
      type: dataType.STRING,
    },
    employmentStatus: {
      type: dataType.STRING,
    },
    curriculumVitae: {
      type: dataType.STRING(1234),
    },
  });
  return beneficiaries;
};
