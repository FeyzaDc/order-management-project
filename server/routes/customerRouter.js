const express = require('express');
const router = express.Router();

const controller = require('../controllers/customerController');

router.get('/', controller.getAllCustomers);                // tüm kullanıcıları getir
router.get('/:customerId', controller.getCustomerById);     // bir kullanıcının bilgileri
router.post('/', controller.createCustomer);                // kullanıcı oluştur
router.put('/:customerId', controller.updateCustomer);      // kullanıcı güncelle
router.delete('/:customerId', controller.deleteCustomer);   // kullanıcı sil

module.exports = router;