module.exports = (sequelize, dataType) => {
  const user = sequelize.define("user", {
    fullName: {
      type: dataType.STRING,
      allowNull: false,
    },
    email: {
      type: dataType.STRING,
      unique: true,
      allowNull: false,
    },
    phoneNumber: {
      type: dataType.STRING,
    },
    password: {
      type: dataType.STRING,
      allowNull: false,
    },
    userName: {
      type: dataType.STRING,
    },
    userType: {
      type: dataType.STRING,
      allowNull: false,
    },
    profileImage: {
      type: dataType.STRING,
    }
  });
  return user;
};
