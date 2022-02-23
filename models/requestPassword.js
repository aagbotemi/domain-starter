module.exports = (sequelize, dataType) => {
    const requestPassword = sequelize.define("requestPassword", {
        resetToken: {
            type: dataType.STRING(2500),
            unique: true,
            allowNull: false,
        },
    });
    return requestPassword;
};
