const DB_NAME = "TFR";
const DB_VERSION = 5;

export interface CustomPic {
  id?: number;
  type: string;
  filename: string;
  blob: Blob;
  uploadTime: Date;
  size: number;
  order?: number;
}

export class AppDatabase {
  private db: IDBDatabase | null = null;
  private urlCache = new Map<number, string>();

  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => { this.db = request.result; resolve(request.result); };
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("projects")) db.createObjectStore("projects", { keyPath: "id", autoIncrement: true });
        if (!db.objectStoreNames.contains("customPics")) {
          const s = db.createObjectStore("customPics", { keyPath: "id", autoIncrement: true });
          s.createIndex("type", "type", { unique: false });
          s.createIndex("uploadTime", "uploadTime", { unique: false });
          s.createIndex("order", "order", { unique: false });
        }
        if (!db.objectStoreNames.contains("autosave")) db.createObjectStore("autosave", { keyPath: "id" });
      };
    });
  }

  /** Replace all blob: URLs in nodes with resolvable __custom_pic__:id references */
  private async serializeBlobUrls(nodes: any[]): Promise<any[]> {
    const snapshot = JSON.parse(JSON.stringify(nodes));

    // Ensure urlCache is populated by loading all custom pics if cache is empty
    if (this.urlCache.size === 0) {
      await this.getAllCustomPics("");
    }

    for (const node of snapshot) {
      if (!node.data) continue;
      const keys = ["leaderImg", "flagImg", "ideologyImg", "factionImg", "focusImg", "newsImg", "eventImg", "superImg", "url", "icon"];
      for (const k of keys) {
        if (typeof node.data[k] === "string" && node.data[k].startsWith("blob:")) {
          const picId = this.getPicIdByUrl(node.data[k]);
          if (picId !== null) node.data[k] = `__custom_pic__:${picId}`;
        }
      }
      if (node.data.spirits) {
        for (const s of node.data.spirits) {
          if (typeof s.url === "string" && s.url.startsWith("blob:")) {
            const picId = this.getPicIdByUrl(s.url);
            if (picId !== null) s.url = `__custom_pic__:${picId}`;
          }
        }
      }
    }
    return snapshot;
  }

  /** Replace __custom_pic__:id references with fresh blob URLs */
  async deserializeBlobUrls(nodes: any[]): Promise<any[]> {
    const snapshot = JSON.parse(JSON.stringify(nodes));
    for (const node of snapshot) {
      if (!node.data) continue;
      const keys = ["leaderImg", "flagImg", "ideologyImg", "factionImg", "focusImg", "newsImg", "eventImg", "superImg", "url", "icon"];
      for (const k of keys) {
        if (typeof node.data[k] === "string" && node.data[k].startsWith("__custom_pic__:")) {
          const id = parseInt(node.data[k].split(":")[1]);
          const url = await this.getUrlForPicId(id);
          if (url) node.data[k] = url;
        }
      }
      if (node.data.spirits) {
        for (const s of node.data.spirits) {
          if (typeof s.url === "string" && s.url.startsWith("__custom_pic__:")) {
            const id = parseInt(s.url.split(":")[1]);
            const url = await this.getUrlForPicId(id);
            if (url) s.url = url;
          }
        }
      }
    }
    return snapshot;
  }

  private getPicIdByUrl(url: string): number | null {
    for (const [id, cachedUrl] of this.urlCache.entries()) {
      if (cachedUrl === url) return id;
    }
    return null;
  }

  private async getUrlForPicId(id: number): Promise<string | null> {
    if (this.urlCache.has(id)) return this.urlCache.get(id)!;
    const db = await this.init();
    return new Promise((resolve) => {
      const request = db.transaction(["customPics"], "readonly").objectStore("customPics").get(id);
      request.onsuccess = () => {
        if (request.result?.blob instanceof Blob) {
          const url = URL.createObjectURL(request.result.blob);
          this.urlCache.set(id, url);
          resolve(url);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  }

  async saveAutosave(data: any) {
    const db = await this.init();
    const serializedNodes = await this.serializeBlobUrls(data.nodes || []);
    const serializedFocusNodes = await this.serializeBlobUrls(data.focusNodes || []);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["autosave"], "readwrite");
      const store = transaction.objectStore("autosave");
      store.put({
        id: "current",
        nodes: serializedNodes,
        focusNodes: serializedFocusNodes,
        focusEdges: JSON.parse(JSON.stringify(data.focusEdges || [])),
        config: data.config || {},
        timestamp: new Date()
      });
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getAutosave(): Promise<any | null> {
    const db = await this.init();
    return new Promise((resolve) => {
      const transaction = db.transaction(["autosave"], "readonly");
      const store = transaction.objectStore("autosave");
      const request = store.get("current");
      request.onsuccess = async () => {
        const result = request.result || null;
        if (result && result.nodes) {
          result.nodes = await this.deserializeBlobUrls(result.nodes);
        }
        if (result && result.focusNodes) {
          result.focusNodes = await this.deserializeBlobUrls(result.focusNodes);
        }
        resolve(result);
      };
      request.onerror = () => resolve(null);
    });
  }

  async saveProject(name: string, nodes: any[], config?: any) {
    const db = await this.init();
    const serializedNodes = await this.serializeBlobUrls(nodes);
    return new Promise((resolve) => {
      const transaction = db.transaction(["projects"], "readwrite");
      transaction.objectStore("projects").put({
        name,
        nodes: serializedNodes,
        config: config || {},
        timestamp: new Date()
      });
      transaction.oncomplete = () => resolve(true);
    });
  }

  async getAllProjects(): Promise<any[]> {
    const db = await this.init();
    return new Promise((resolve) => {
      const request = db.transaction(["projects"], "readonly").objectStore("projects").getAll();
      request.onsuccess = async () => {
        const results = request.result.sort((a: any, b: any) => b.timestamp - a.timestamp);
        for (const p of results) {
          if (p.nodes) p.nodes = await this.deserializeBlobUrls(p.nodes);
        }
        resolve(results);
      };
    });
  }

  async deleteProject(id: number) {
    const db = await this.init();
    db.transaction(["projects"], "readwrite").objectStore("projects").delete(id);
  }

  async addCustomPic(type: string, filename: string, blob: Blob) {
    const db = await this.init();
    const pics = await this.getAllCustomPics(type);
    const maxOrder = pics.length > 0 ? Math.max(...pics.map(p => p.order || 0)) : 0;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["customPics"], "readwrite");
      const request = transaction.objectStore("customPics").add({
        type,
        filename,
        blob,
        uploadTime: new Date(),
        size: blob.size,
        order: maxOrder + 1
      });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllCustomPics(type?: string): Promise<any[]> {
    const db = await this.init();
    return new Promise((resolve) => {
      const store = db.transaction(["customPics"], "readonly").objectStore("customPics");
      const request = type ? store.index("type").getAll(type) : store.getAll();
      request.onsuccess = () => {
        const results = request.result
          .sort((a: any, b: any) => {
            if (a.order !== undefined && b.order !== undefined) {
              return a.order - b.order;
            }
            return b.uploadTime - a.uploadTime;
          })
          .map((item: any) => {
            if (!(item.blob instanceof Blob)) {
              return { ...item, url: item.blob };
            }
            if (!this.urlCache.has(item.id)) this.urlCache.set(item.id, URL.createObjectURL(item.blob));
            return { ...item, url: this.urlCache.get(item.id) };
          });
        resolve(results);
      };
    });
  }

  async getBlobByUrl(url: string): Promise<Blob | null> {
    for (const [id, cachedUrl] of this.urlCache.entries()) {
      if (cachedUrl === url) {
        const db = await this.init();
        return new Promise((resolve) => {
          const request = db.transaction(["customPics"], "readonly").objectStore("customPics").get(id);
          request.onsuccess = () => resolve(request.result?.blob || null);
          request.onerror = () => resolve(null);
        });
      }
    }
    return null;
  }

  async getCustomPicByUrl(url: string): Promise<{ blob: Blob; filename: string } | null> {
    for (const [id, cachedUrl] of this.urlCache.entries()) {
      if (cachedUrl === url) {
        const db = await this.init();
        return new Promise((resolve) => {
          const request = db.transaction(["customPics"], "readonly").objectStore("customPics").get(id);
          request.onsuccess = () => {
            if (request.result?.blob) {
              resolve({ blob: request.result.blob, filename: request.result.filename || "" });
            } else {
              resolve(null);
            }
          };
          request.onerror = () => resolve(null);
        });
      }
    }
    return null;
  }

  async batchUpdatePicOrder(updates: { id: number, order: number }[]) {
    const db = await this.init();
    const transaction = db.transaction(["customPics"], "readwrite");
    const store = transaction.objectStore("customPics");
    for (const update of updates) {
      const request = store.get(update.id);
      request.onsuccess = () => {
        const item = request.result;
        if (item) {
          item.order = update.order;
          store.put(item);
        }
      };
    }
  }

  async deleteCustomPic(id: number) {
    const db = await this.init();
    if (this.urlCache.has(id)) { URL.revokeObjectURL(this.urlCache.get(id)!); this.urlCache.delete(id); }
    db.transaction(["customPics"], "readwrite").objectStore("customPics").delete(id);
  }

  async renamePic(id: number, newName: string) {
    const db = await this.init();
    const transaction = db.transaction(["customPics"], "readwrite");
    const store = transaction.objectStore("customPics");
    const request = store.get(id);
    request.onsuccess = () => {
      const item = request.result;
      if (item) {
        item.filename = newName;
        store.put(item);
      }
    };
  }

  async clearStore(name: string) {
    const db = await this.init();
    db.transaction([name], "readwrite").objectStore(name).clear();
    if (name === 'customPics') {
      this.urlCache.forEach(url => URL.revokeObjectURL(url));
      this.urlCache.clear();
    }
  }
}

export const db = new AppDatabase();
