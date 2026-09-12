import { Restaurant, Order, Commission } from '../models/models.js'
import { Op } from 'sequelize'

const checkRestaurantOwnership = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    if (req.user.id === restaurant.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}
const restaurantHasNoOrders = async (req, res, next) => {
  try {
    const numberOfRestaurantOrders = await Order.count({
      where: { restaurantId: req.params.restaurantId }
    })
    if (numberOfRestaurantOrders === 0) {
      return next()
    }
    return res.status(409).send('Some orders belong to this restaurant.')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const isFreeCommission = async (commissionId) => {
  const commission = await Commission.findByPk(commissionId)
  return commission && commission.percentage === 0
}

const checkFreeCommissionLimitDuringCreation = async (req, res, next) => {
  try {
    let suma = 0
    const restaurantes = await Restaurant.findAll({ where: { userId: req.user.id} } )
    const esGratis = isFreeCommission(req.body.commissionId)
    for (const restaurante of restaurantes) {
      if (isFreeCommission(restaurante.commissionId)) {
        suma += 1
      }
    }
    if (esGratis && suma > 0) {
      return res.status(409).send('No se puede poner otro restaurante gratis si ya hay otro anteriormente')
    }
    return next()
  } catch (err) {
    return res.status(500).send("To be implemented")
  }
}

const checkFreeCommissionLimitDuringUpdate = async (req, res, next) => {
  return res.status(500).send("To be implemented")
}

const checkNoOrdersWhenSwitchingToFree = async (req, res, next) => {
  try {
    const numPedidos = await Order.count({ where: { restaurantId: req.params.restaurantId } })
    const esGratis = isFreeCommission(req.body.commissionId)
    if (numPedidos > 0 && esGratis) {
      return res.status(409).send('This restaurant has already some orders or it was free already')
    }
  return next()
  } catch (err) {
    return res.status(500).send("To be implemented")
  }
}

export { checkRestaurantOwnership, restaurantHasNoOrders, checkFreeCommissionLimitDuringCreation, checkFreeCommissionLimitDuringUpdate, checkNoOrdersWhenSwitchingToFree }
