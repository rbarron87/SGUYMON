const { sequelize } = require('../src/models');
const fs = require('fs');
const path = require('path');

async function resetDatabase() {
  try {
    console.log('Dropping all tables...');
    await sequelize.drop();
    console.log('All tables dropped successfully');

    console.log('Syncing database...');
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Check if seed file exists
    const seedFile = path.join(__dirname, '../src/seeders/seed.js');
    if (fs.existsSync(seedFile)) {
      console.log('Running seeders...');
      require(seedFile);
      console.log('Seeders completed successfully');
    }

    console.log('Database reset completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase(); 