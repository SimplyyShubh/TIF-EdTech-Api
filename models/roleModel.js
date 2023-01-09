module.exports = (sequelizeInstance, DataTypes) => {
    const Role = sequelizeInstance.define("role", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        scopes: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
    });
    return Role ;
} ;