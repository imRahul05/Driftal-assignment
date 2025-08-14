import { seedDatabase, generateAdditionalData } from '../utils/dataSeeder.js';

export const seedData = async (req, res) => {
  try {
    console.log('🌱 Data seeding requested...');
    
    const result = await seedDatabase();
    
    res.status(200).json({
      success: true,
      message: 'Database seeded successfully',
      ...result
    });

  } catch (error) {
    console.error('❌ Data seeding failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
};

export const addMoreData = async (req, res) => {
  try {
    const { count = 1000 } = req.body;
    
    console.log(`🌱 Adding ${count} more records...`);
    
    const result = await generateAdditionalData(parseInt(count));
    
    res.status(200).json({
      success: true,
      message: `Added ${count} new records successfully`,
      ...result
    });

  } catch (error) {
    console.error('❌ Failed to add more data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add more data',
      error: error.message
    });
  }
};

export default {
  seedData,
  addMoreData
};
