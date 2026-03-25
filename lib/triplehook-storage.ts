import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { TriplehookRecord } from './triplehook-schema';

const DATA_DIR = path.join(process.cwd(), '.data');
const TRIPLEHOOK_FILE = path.join(DATA_DIR, 'triplehooks.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('[v0] Failed to create data directory:', err);
  }
}

async function readTriplehooks(): Promise<Record<string, TriplehookRecord>> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(TRIPLEHOOK_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeTriplehooks(data: Record<string, TriplehookRecord>) {
  try {
    await ensureDataDir();
    await fs.writeFile(TRIPLEHOOK_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[v0] Failed to write triplehooks:', err);
  }
}

export async function createTriplehook(
  directory: string,
  webhook1: string,
  webhook2: string,
  discord_server: string = 'https://discord.gg/xDQmmHKAxx'
): Promise<TriplehookRecord> {
  const id = crypto.randomUUID();
  const token = crypto.randomBytes(32).toString('hex');
  
  const record: TriplehookRecord = {
    id,
    directory,
    webhook1,
    webhook2,
    discord_server,
    token,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const triplehooks = await readTriplehooks();
  triplehooks[id] = record;
  await writeTriplehooks(triplehooks);

  return record;
}

export async function getTriplehook(id: string): Promise<TriplehookRecord | null> {
  const triplehooks = await readTriplehooks();
  return triplehooks[id] || null;
}

export async function getAllTriplehooks(): Promise<TriplehookRecord[]> {
  const triplehooks = await readTriplehooks();
  return Object.values(triplehooks);
}

export async function deleteTriplehook(id: string): Promise<boolean> {
  const triplehooks = await readTriplehooks();
  if (triplehooks[id]) {
    delete triplehooks[id];
    await writeTriplehooks(triplehooks);
    return true;
  }
  return false;
}
