module.exports = (sequelizeInstance, DataTypes) => {
  const Student = sequelizeInstance.define("student", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Student;
};
