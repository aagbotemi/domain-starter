module.exports = (sequelize, dataType) => {
    const auditTrail = sequelize.define("auditTrail", {
        // actor: {
        //     type: dataType.STRING,
        // },
        action: {
            type: dataType.STRING,
        },
        type: {
            type: dataType.STRING,
        }
    });
    return auditTrail;
  };