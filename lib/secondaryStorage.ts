interface StorageItem {
  value: string;
  expiresAt: Date | null;
}

export class SecondaryStorage {
  private storage: Map<string, StorageItem>;

  constructor() {
    this.storage = new Map();
  }

  async get(key: string): Promise<string | null> {
    const item = this.storage.get(key);
    if (!item) return null;

    if (item.expiresAt && item.expiresAt < new Date()) {
      this.storage.delete(key);
      return null;
    }

    return item.value;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const expiresAt = ttl ? new Date(Date.now() + ttl * 1000) : null;
    this.storage.set(key, { value, expiresAt });
  }

  async delete(key: string): Promise<void> {
    this.storage.delete(key);
  }
}
