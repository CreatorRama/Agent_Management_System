const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://agent-management-system-gamma.vercel.app','https://agent-management-system-creatorramas-projects.vercel.app','http://localhost:3000']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/agents', require('./routes/agents'));
app.use('/api/lists', require('./routes/lists'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Create default admin user if not exists
const createDefaultAdmin = async () => {
  const User = require('./models/User');
  
  try {
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
     
      const admin = new User({
        email: 'admin@example.com',
        password:'admin123'
      })

      
      await admin.save();
      console.log('Default admin created: admin@example.com / admin123');
    }

  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

createDefaultAdmin();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));