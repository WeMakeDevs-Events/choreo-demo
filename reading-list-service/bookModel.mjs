import { DataTypes } from 'sequelize';
import sequelize from './db.mjs';

const Book = sequelize.define('Book', {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('read', 'to_read', 'reading'),
    allowNull: false
  }
}, {
  tableName: 'books',
  timestamps: false
});

export default Book;
