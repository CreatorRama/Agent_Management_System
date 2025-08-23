const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const Agent = require('../models/Agent');
const List = require('../models/List');

exports.uploadAndDistribute = async (req, res) => {
  let filePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    
    console.log('File uploaded:', {
      originalName: req.file.originalname,
      filePath: filePath,
      extension: fileExtension,
      size: req.file.size
    });

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ msg: 'Uploaded file not found' });
    }
    
    let data = [];

    // Parse file based on extension
    try {
      if (fileExtension === '.csv') {
        data = await parseCSV(filePath);
      } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        data = await parseExcel(filePath);
      } else {
        return res.status(400).json({ msg: 'Invalid file format. Only CSV, XLSX, and XLS files are allowed.' });
      }
    } catch (parseError) {
      console.error('File parsing error:', parseError);
      return res.status(400).json({ msg: 'Error parsing file. Please check file format and content.' });
    }

    console.log('Parsed data:', data.length, 'rows');

    // Validate data format
    const isValid = validateData(data);
    if (!isValid) {
      return res.status(400).json({ 
        msg: 'Invalid file format. Required columns: FirstName, Phone. Notes column is optional.' 
      });
    }

    // Get all agents
    const agents = await Agent.find().limit(5);
    if (agents.length === 0) {
      return res.status(400).json({ msg: 'No agents found. Please create agents first.' });
    }

    console.log('Found agents:', agents.length);

    // Clear existing lists for all agents
    await List.deleteMany({});

    // Distribute data among agents
    const distributedData = distributeData(data, agents);

    // Save distributed lists to database
    const savedLists = [];
    for (const distribution of distributedData) {
      const list = new List({
        agentId: distribution.agent._id,
        agentName: distribution.agent.name,
        items: distribution.items
      });
      await list.save();
      savedLists.push(list);
    }

    console.log('Distribution completed successfully');

    res.json({
      message: 'File uploaded and distributed successfully',
      totalItems: data.length,
      agentsCount: agents.length,
      distribution: distributedData.map(d => ({
        agentName: d.agent.name,
        itemCount: d.items.length
      }))
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ msg: 'Server error: ' + error.message });
  } finally {
    // Clean up uploaded file
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log('Temporary file cleaned up:', filePath);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
  }
};

exports.getAgentLists = async (req, res) => {
  try {
    const lists = await List.find().populate('agentId', 'name email');
    res.json(lists);
  } catch (error) {
    console.error('Get lists error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Helper functions
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = fs.createReadStream(filePath);
    
    stream
      .pipe(csv())
      .on('data', (data) => {
        // Clean up the data - remove BOM and trim whitespace
        const cleanedData = {};
        Object.keys(data).forEach(key => {
          const cleanKey = key.replace(/^\uFEFF/, '').trim(); // Remove BOM
          cleanedData[cleanKey] = typeof data[key] === 'string' ? data[key].trim() : data[key];
        });
        results.push(cleanedData);
      })
      .on('end', () => {
        console.log('CSV parsing completed, rows:', results.length);
        resolve(results);
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      });
  });
};

const parseExcel = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    // Clean up the data
    const cleanedData = data.map(row => {
      const cleanedRow = {};
      Object.keys(row).forEach(key => {
        const cleanKey = key.trim();
        cleanedRow[cleanKey] = typeof row[key] === 'string' ? row[key].trim() : row[key];
      });
      return cleanedRow;
    });
    
    console.log('Excel parsing completed, rows:', cleanedData.length);
    return cleanedData;
  } catch (error) {
    console.error('Excel parsing error:', error);
    throw error;
  }
};

const validateData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.log('Validation failed: No data or empty array');
    return false;
  }
  
  const requiredColumns = ['FirstName', 'Phone'];
  const firstRow = data[0];
  const availableColumns = Object.keys(firstRow);
  
  console.log('Available columns:', availableColumns);
  console.log('Required columns:', requiredColumns);
  
  const hasRequiredColumns = requiredColumns.every(col => 
    availableColumns.some(availableCol => 
      availableCol.toLowerCase().includes(col.toLowerCase()) || 
      col.toLowerCase().includes(availableCol.toLowerCase())
    )
  );
  
  if (!hasRequiredColumns) {
    console.log('Validation failed: Missing required columns');
    return false;
  }
  
  // Check if data has valid entries
  const validRows = data.filter(row => 
    requiredColumns.some(col => {
      const matchingKey = Object.keys(row).find(key => 
        key.toLowerCase().includes(col.toLowerCase()) || 
        col.toLowerCase().includes(key.toLowerCase())
      );
      return matchingKey && row[matchingKey] !== undefined && row[matchingKey] !== '';
    })
  );
  
  console.log('Valid rows found:', validRows.length, 'out of', data.length);
  return validRows.length > 0;
};

const distributeData = (data, agents) => {
  const itemsPerAgent = Math.floor(data.length / agents.length);
  const remainder = data.length % agents.length;
  
  const distributions = [];
  let currentIndex = 0;
  
  for (let i = 0; i < agents.length; i++) {
    const itemsForThisAgent = itemsPerAgent + (i < remainder ? 1 : 0);
    const items = data.slice(currentIndex, currentIndex + itemsForThisAgent).map(item => {
      // Find the correct column names (case insensitive)
      const firstNameKey = Object.keys(item).find(key => 
        key.toLowerCase().includes('firstname') || key.toLowerCase().includes('first')
      ) || 'FirstName';
      
      const phoneKey = Object.keys(item).find(key => 
        key.toLowerCase().includes('phone') || key.toLowerCase().includes('number')
      ) || 'Phone';
      
      const notesKey = Object.keys(item).find(key => 
        key.toLowerCase().includes('notes') || key.toLowerCase().includes('note')
      ) || 'Notes';
      
      return {
        firstName: item[firstNameKey] || '',
        phone: (item[phoneKey] || '').toString(),
        notes: item[notesKey] || ''
      };
    });
    
    distributions.push({
      agent: agents[i],
      items
    });
    
    currentIndex += itemsForThisAgent;
  }
  
  console.log('Distribution:', distributions.map(d => ({ 
    agent: d.agent.name, 
    items: d.items.length 
  })));
  
  return distributions;
};