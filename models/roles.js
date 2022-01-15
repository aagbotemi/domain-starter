module.exports = (sequelize, dataType) => {
  const roles = sequelize.define("roles", {
    roleName: {
      type: dataType.STRING,
      allowNull: false,
      unique: true,
    },
    roleDescription: {
      type: dataType.STRING
    },
  });
  return roles;
};
