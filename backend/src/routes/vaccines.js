const express = require('express');
const router = express.Router();
const vaccineService = require('../services/vaccineService');
const fdaService = require('../services/fdaService');

// Get all vaccines
router.get('/', async (req, res) => {
  try {
    const vaccines = await vaccineService.getAllVaccines();
    res.json({
      success: true,
      data: vaccines,
      count: vaccines.length
    });
  } catch (error) {
    console.error('Error fetching vaccines:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vaccines',
      message: error.message
    });
  }
});

// Get specific vaccine by ID with detailed information
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vaccine = await vaccineService.getVaccineById(id);
    
    if (!vaccine) {
      return res.status(404).json({
        success: false,
        error: 'Vaccine not found'
      });
    }

    // Get clinical trials and adverse effects
    const [clinicalTrials, adverseEffects] = await Promise.all([
      vaccineService.getClinicalTrials(id),
      vaccineService.getAdverseEffects(id)
    ]);

    res.json({
      success: true,
      data: {
        ...vaccine,
        clinicalTrials,
        adverseEffects
      }
    });
  } catch (error) {
    console.error('Error fetching vaccine details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vaccine details',
      message: error.message
    });
  }
});

// Search vaccines by name
router.get('/search/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const vaccines = await vaccineService.searchVaccines(name);
    
    res.json({
      success: true,
      data: vaccines,
      count: vaccines.length
    });
  } catch (error) {
    console.error('Error searching vaccines:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search vaccines',
      message: error.message
    });
  }
});

// Refresh vaccine data from FDA (admin endpoint)
router.post('/refresh-fda-data', async (req, res) => {
  try {
    console.log('Starting FDA data refresh...');
    const result = await fdaService.refreshVaccineData();
    
    res.json({
      success: true,
      message: 'FDA data refresh completed',
      data: result
    });
  } catch (error) {
    console.error('Error refreshing FDA data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh FDA data',
      message: error.message
    });
  }
});

// Get vaccine statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await vaccineService.getVaccineStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching vaccine stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vaccine statistics',
      message: error.message
    });
  }
});

module.exports = router;

