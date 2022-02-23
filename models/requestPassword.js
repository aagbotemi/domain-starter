module.exports = (sequelize, dataType) => {
    const requestPassword = sequelize.define("requestPassword", {
        resetToken: {
            type: dataType.STRING,
            unique: true,
            allowNull: false,
        },
    });
    return requestPassword;
};
