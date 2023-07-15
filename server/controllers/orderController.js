const pool = require('../config/db');
const Order = require('../models/orderModel');

exports.getAllOrders = async (req, res) => {
    const customerId = req.params.customerId;

    try {
        const query = 'SELECT * FROM orders WHERE "customerId" = $1';
        const result = await pool.query(query, [customerId]);
        
        const orders = result.rows.map(row => {
            const { id, customerId, name, price, createdDate } = row;
            return new Order(id, customerId, name, price, createdDate);
        });

        // res.status(200).json({
        //     success: true,
        //     data: orders
        // });

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

exports.getOrderById = async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const query = 'SELECT * FROM orders WHERE id = $1';
        const result = await pool.query(query, [orderId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        const { id, customerId, name, price, createdDate } = result.rows[0];
        const order = new Order(id, customerId, name, price, createdDate);

        res.json(order);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

exports.createOrder = async (req, res) => {
    const customerId = req.params.customerId;
    const { name, price } = req.body;

    try {
        // Check if user exists in database
        const customerQuery = 'SELECT * FROM customers WHERE id = $1';
        const customerResult = await pool.query(customerQuery, [customerId]);
        const customer = customerResult.rows[0];
        if (!customer) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Create a new order
        const createdDate = new Date();

        const query = 'INSERT INTO orders ("customerId", "name", "price", "createdDate") VALUES ($1, $2, $3, $4) RETURNING id';
        const result = await pool.query(query, [customerId, name, price, createdDate]);

        const orderId = result.rows[0].id;
        const order = new Order(orderId, customerId, name, price, createdDate);

        res.json(order);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

exports.updateOrder = async (req, res) => {
    const customerId = req.params.customerId;
    const orderId = req.params.orderId;
    const { name, price } = req.body;

    try {
        const checkQuery = 'SELECT * FROM orders WHERE id = $1';
        const checkResult = await pool.query(checkQuery, [orderId]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        const createdDate = new Date();

        const query = 'UPDATE orders SET name = $1, price = $2, "createdDate" = $3 WHERE id = $4';
        await pool.query(query, [name, price, createdDate, orderId]);

        const order = new Order(orderId, customerId, name, price, createdDate);

        res.json(order);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.deleteOrder = async (req, res) => {
    const customerId = req.params.customerId;
    const orderId = req.params.orderId;

    try {
        const checkQuery = 'SELECT FROM orders WHERE id = $1 and "customerId" = $2';
        const checkResult = await pool.query(checkQuery, [orderId, customerId]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: `User does not have an order with id ${orderId}`
            });
        }

        const query = 'DELETE FROM orders WHERE id = $1 and "customerId" = $2';
        await pool.query(query, [orderId, customerId]);

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};