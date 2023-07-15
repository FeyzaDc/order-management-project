const express = require('express');
const router = express.Router();

const controller = require('../controllers/orderController');

router.get('/:customerId/orders', controller.getAllOrders);
router.get('/:customerId/orders/:orderId', controller.getOrderById);
router.post('/:customerId/orders', controller.createOrder);
router.put('/:customerId/orders/:orderId', controller.updateOrder);
router.delete('/:customerId/orders/:orderId', controller.deleteOrder);

module.exports = router;