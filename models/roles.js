module.exports = (sequelize, dataType) => {
  const roles = sequelize.define("roles", {
    roleName: {
      type: dataType.STRING,
      allowNull: false,
    },
    roleDescription: {
      type: dataType.STRING,
      unique: true,
      allowNull: false,
    },
  });
  return roles;
};
