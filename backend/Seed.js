const fs = require('fs')
const path = require('path')
const pool = require('./db')

const seedDatabase = async () => {
    const signs = fs.readdirSync(path.join(__dirname, '../assets/images/signs'))
    console.log(`Found ${signs.length}`)

    for (const sign of signs) {
        if (!sign.endsWith('.svg')) continue;
        const parts = sign.split('--');
        const category = parts[0];
        const name = parts[1].replace(/-/g, ' ')
        const cleanName = name.charAt(0).toUpperCase() + name.slice(1);

        await pool.query('INSERT INTO road_signs (display_name, file_name, category) VALUES ($1, $2, $3) ', [cleanName, sign, category])
    }

    console.log('Seeding Complete')
    await pool.end();
}

seedDatabase();