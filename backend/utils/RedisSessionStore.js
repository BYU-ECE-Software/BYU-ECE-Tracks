// src/session/RedisSessionStore.js
import Redis from "ioredis";
import { SessionStore, LockError } from "@byu-oit-sdk/session";

export class RedisSessionStore extends SessionStore {
  constructor(opts = {}) {
    super();
    this.prefix = opts.prefix ?? "sess";
    this.maxLockTime = (opts.maxLockTime ?? 10) * 1000; // ms
    this.redis = opts.client ?? new Redis(opts.url ?? process.env.REDIS_URL ?? "redis://localhost:6379");
  }
  key(id) { return `${this.prefix}:${id}`; }
  async init() { await this.redis.ping(); }
  async close() { await this.redis.quit(); }
  async get(id) {
    const raw = await this.redis.get(this.key(id));
    if (!raw) return undefined;
    const data = JSON.parse(raw);
    const nowSec = Math.floor(Date.now() / 1000);
    if (typeof data.expires === "number" && data.expires <= nowSec) {
      await this.destroy(id);
      return undefined;
    }
    return data;
  }
  async set(id, data) {
    const ttlSec = Math.max(1, Math.floor(data.expires - Date.now() / 1000));
    await this.redis.set(this.key(id), JSON.stringify(data), "EX", ttlSec);
    return true;
  }
  async unset(id, props) {
    const current = await this.get(id);
    if (!current) return false;
    for (const p of props) delete current[p];
    await this.set(id, current);
    return true;
  }
  async destroy(id) { return (await this.redis.del(this.key(id))) > 0; }
  async lock(id, value) {
    const now = Date.now();
    const rec = (await this.get(id)) ?? { expires: Math.floor(now / 1000) + 1200 };
    if (rec.locked && now - rec.locked.timestamp < this.maxLockTime) {
      throw new LockError("Session row is already locked");
    }
    rec.locked = { timestamp: now, value };
    await this.set(id, rec);
    return true;
  }
  async unlock(id) {
    const rec = await this.get(id);
    if (!rec) return false;
    delete rec.locked;
    await this.set(id, rec);
    return true;
  }
}
