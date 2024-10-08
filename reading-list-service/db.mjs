import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME,    
  process.env.DB_USER,    
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT
  }
);

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
  sequelize.sync().then(() => {
    console.log('Database & tables created!');
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});


export default sequelize;




