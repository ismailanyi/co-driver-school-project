const { Pool } = require('pg');
require('dotenv').config();
console.log("Debugging DB Name:", process.env.PGDATABASE); // Is this undefined?

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
})


module.exports = pool;