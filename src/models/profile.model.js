/**
 * profile.model.js
 * Schema Model - Được sinh tự động bởi Antigravity Agent
 * Nhiệm vụ: Thiết kế CSDL & Schema Models cho Quản lý Hồ sơ (Profile)
 */

class EntityModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.title = data.title || '';
    this.status = data.status || 'active';
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  validate() {
    if (!this.title) throw new Error('Title is required');
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      status: this.status,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = EntityModel;
