const redis = require('redis');

class CacheService {
  constructor() {
    this.client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    this.client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });
    
    this.client.connect();
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, expiration = 3600) {
    try {
      await this.client.setEx(key, expiration, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async delete(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async deletePattern(pattern) {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return false;
    }
  }

  async increment(key, value = 1) {
    try {
      return await this.client.incrBy(key, value);
    } catch (error) {
      console.error('Cache increment error:', error);
      return null;
    }
  }

  async hgetall(key) {
    try {
      return await this.client.hGetAll(key);
    } catch (error) {
      console.error('Cache hgetall error:', error);
      return null;
    }
  }

  async hset(key, field, value) {
    try {
      return await this.client.hSet(key, field, value);
    } catch (error) {
      console.error('Cache hset error:', error);
      return null;
    }
  }

  async sadd(key, value) {
    try {
      return await this.client.sAdd(key, value);
    } catch (error) {
      console.error('Cache sadd error:', error);
      return null;
    }
  }

  async smembers(key) {
    try {
      return await this.client.sMembers(key);
    } catch (error) {
      console.error('Cache smembers error:', error);
      return null;
    }
  }

  async exists(key) {
    try {
      return await this.client.exists(key);
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async ttl(key) {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error('Cache ttl error:', error);
      return -1;
    }
  }
}

module.exports = new CacheService();