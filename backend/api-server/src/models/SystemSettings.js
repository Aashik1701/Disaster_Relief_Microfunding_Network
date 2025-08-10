const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const SystemSettings = sequelize.define('SystemSettings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('string', 'number', 'boolean', 'json', 'array'),
    defaultValue: 'string'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(50),
    defaultValue: 'general'
  },
  isReadOnly: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastModifiedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'system_settings',
  indexes: [
    { fields: ['key'] },
    { fields: ['category'] }
  ]
});

// Instance methods
SystemSettings.prototype.getParsedValue = function() {
  switch (this.type) {
    case 'number':
      return parseFloat(this.value);
    case 'boolean':
      return this.value === 'true';
    case 'json':
      try {
        return JSON.parse(this.value);
      } catch (e) {
        return null;
      }
    case 'array':
      try {
        return JSON.parse(this.value);
      } catch (e) {
        return [];
      }
    default:
      return this.value;
  }
};

// Class methods
SystemSettings.getSetting = async function(key, defaultValue = null) {
  const setting = await this.findOne({ where: { key } });
  return setting ? setting.getParsedValue() : defaultValue;
};

SystemSettings.setSetting = async function(key, value, type = 'string', description = null, category = 'general', userId = null) {
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
  
  const [setting, created] = await this.findOrCreate({
    where: { key },
    defaults: {
      value: stringValue,
      type,
      description,
      category,
      lastModifiedBy: userId
    }
  });
  
  if (!created) {
    await setting.update({
      value: stringValue,
      type,
      description: description || setting.description,
      category: category || setting.category,
      lastModifiedBy: userId
    });
  }
  
  return setting;
};

SystemSettings.getCategory = async function(category) {
  const settings = await this.findAll({
    where: { category },
    order: [['key', 'ASC']]
  });
  
  const result = {};
  settings.forEach(setting => {
    result[setting.key] = setting.getParsedValue();
  });
  
  return result;
};

SystemSettings.getAllSettings = async function() {
  const settings = await this.findAll({
    order: [['category', 'ASC'], ['key', 'ASC']]
  });
  
  const result = {};
  settings.forEach(setting => {
    if (!result[setting.category]) {
      result[setting.category] = {};
    }
    result[setting.category][setting.key] = {
      value: setting.getParsedValue(),
      type: setting.type,
      description: setting.description,
      isReadOnly: setting.isReadOnly,
      updatedAt: setting.updatedAt
    };
  });
  
  return result;
};

module.exports = SystemSettings;
