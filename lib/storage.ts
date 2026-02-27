import { promises as fs } from "fs";
import path from "path";

interface BypassRequestRecord {
  id: string;
  cookie: string;
  status: "pending" | "success" | "failed";
  data?: any;
  createdAt: string;
  updatedAt: string;
}

class Storage {
  private storageDir = path.join(process.cwd(), ".data");

  async init() {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
    } catch (error) {
      console.error("Failed to initialize storage directory:", error);
    }
  }

  async createBypassRequest(
    data: Pick<BypassRequestRecord, "cookie">
  ): Promise<BypassRequestRecord> {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const now = new Date().toISOString();

    const record: BypassRequestRecord = {
      id,
      cookie: data.cookie,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    try {
      const filePath = path.join(this.storageDir, `${id}.json`);
      await fs.writeFile(filePath, JSON.stringify(record, null, 2));
    } catch (error) {
      console.error("Failed to create bypass request:", error);
    }

    return record;
  }

  async updateBypassRequestStatus(
    id: string,
    status: "success" | "failed",
    data?: any
  ): Promise<void> {
    try {
      const filePath = path.join(this.storageDir, `${id}.json`);
      const content = await fs.readFile(filePath, "utf-8");
      const record: BypassRequestRecord = JSON.parse(content);

      record.status = status;
      record.data = data;
      record.updatedAt = new Date().toISOString();

      await fs.writeFile(filePath, JSON.stringify(record, null, 2));
    } catch (error) {
      console.error("Failed to update bypass request:", error);
    }
  }

  async getBypassRequest(id: string): Promise<BypassRequestRecord | null> {
    try {
      const filePath = path.join(this.storageDir, `${id}.json`);
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.error("Failed to get bypass request:", error);
      return null;
    }
  }
}

export const storage = new Storage();
