import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class Commission extends Model {
    static associate(models) {
      Commission.hasMany(models.Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' })
    }
  }
  Commission.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    percentage: {
      allowNull: false,
      type: DataTypes.DOUBLE
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  }, {
    sequelize,
    modelName: 'Commission'
  })
  return Commission
}
export default loadModel
