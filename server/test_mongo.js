const mongoose = require('mongoose');
const uri = 'mongodb://stharsancs_db_user:YjFwPueB3OBcAaTU@ac-qd9bjf6-shard-00-00.cbup8xx.mongodb.net:27017,ac-qd9bjf6-shard-00-01.cbup8xx.mongodb.net:27017,ac-qd9bjf6-shard-00-02.cbup8xx.mongodb.net:27017/meetgraph?ssl=true&replicaSet=atlas-d6dj6k-shard-0&authSource=admin&appName=meetings';

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connection SUCCESSFUL');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection FAILED:', err.message);
    process.exit(1);
  });
