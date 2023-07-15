const {
    Pool
} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'orderManagementDb',
    password: '63324',
    port: 5432,
});

module.exports = pool;

// Test bağlantısı yapısı
pool.connect((err, client, release) => {
    if (err) {
        console.error('Veritabanı bağlantısı başarısız:', err.stack);
    } else {
        console.log('Veritabanı bağlantısı başarılı!');
    }
    release();
});