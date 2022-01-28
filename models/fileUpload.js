module.exports = (sequelize, dataType) => {
  const fileUpload = sequelize.define("fileUpload", {
    data: {
      type: dataType.BLOB("long"),
    },
  });

  return fileUpload;
};
