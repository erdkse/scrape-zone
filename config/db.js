const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

mongoose.set('useCreateIndex', true);

try {
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
} catch (error) {
  mongoose.createConnection(process.env.DATABASE_URL);
}

mongoose.connection.once('open', () => console.log('MongoDB is connected'));
