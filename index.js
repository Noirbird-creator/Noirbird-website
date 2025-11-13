const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const productRoutes = require('./routes/products');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));
app.use('/api/products', productRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
