const pool = require('../config/db');
const Customer = require('../models/customerModel');

exports.getAllCustomers = async (req, res) => {
    try {
        const query = 'SELECT * FROM customers';
        const result = await pool.query(query);

        // Converting results to Customer objects
        const customers = result.rows.map(row => {
            const { id, firstName, lastName, email, age } = row;
            return new Customer(id, firstName, lastName, email, age);
        });

        res.json(customers);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

exports.getCustomerById = async (req, res) => {
    const customerId = req.params.customerId;

    try {
        const query = 'SELECT * FROM customers WHERE id = $1';
        const result = await pool.query(query, [customerId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Customer not found'
            });
        }

        const { id, firstName, lastName, email, age } = result.rows[0];
        const customer = new Customer(id, firstName, lastName, email, age);

        res.json(customer);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.createCustomer = async (req, res) => {
    const { firstName, lastName, email, age } = req.body;

    try {
        const query = 'INSERT INTO customers ("firstName", "lastName", email, age) VALUES ($1, $2, $3, $4) RETURNING id';
        const result = await pool.query(query, [firstName, lastName, email, age]);

        const customerId = result.rows[0].id;
        const customer = new Customer(customerId, firstName, lastName, email, age);

        res.json(customer);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.updateCustomer = async (req, res) => {
    const customerId = req.params.customerId;
    const { firstName, lastName, email, age } = req.body;

    try {
        const controlQuery = 'SELECT * FROM customers WHERE id = $1';
        const controlResult = await pool.query(controlQuery, [customerId]);

        if (controlResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Customer not found'
            });
        }

        const query = 'UPDATE customers SET "firstName" = $1, "lastName" = $2, email = $3, age = $4 WHERE id = $5';
        await pool.query(query, [firstName, lastName, email, age, customerId]);

        const customer = new Customer(customerId, firstName, lastName, email, age);

        res.json(customer);
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.deleteCustomer = async (req, res) => {
    const customerId = req.params.customerId;

    try {
        const controlQuery = 'SELECT * FROM customers WHERE id = $1';
        const controlResult = await pool.query(controlQuery, [customerId]);

        if (controlResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Customer not found'
            });
        }
        
        const query = 'DELETE FROM customers WHERE id = $1';
        await pool.query(query, [customerId]);

        res.status(200).json({
            success: true,
            message: 'Customer deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};