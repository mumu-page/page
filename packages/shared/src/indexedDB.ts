/* 表示数据库的名字。如果指定的数据库不存在，就会新建数据库。 */
const DATABASE_NAME = 'r-generator'
/* 如果省略，打开已有数据库时，默认为当前版本；新建数据库时，默认为1 */
const VERSION = 1
const TABLE_NAME = 'store'

export default class IndexedDB {
  db: IDBDatabase | null = null
  databaseName: string
  version: number | undefined
  tableName: string
  constructor(
    databaseName: string = DATABASE_NAME,
    version: number | undefined = VERSION,
    tableName: string = TABLE_NAME
  ) {
    this.databaseName = databaseName
    this.version = version
    this.tableName = tableName
    this.connections()
  }

  async connections(
    databaseName: string = DATABASE_NAME,
    version: number | undefined = VERSION,
    tableName: string = TABLE_NAME
  ) {
    return new Promise((resolve, reject) => {
      if (this.db) resolve(this.db)
      const request = window.indexedDB.open(databaseName, version)
      request.onerror = (_event) => {
        reject('数据库打开报错')
      }
      request.onsuccess = (_event) => {
        this.db = request.result
        this.databaseName = databaseName
        this.version = version
        this.tableName = tableName
        resolve(this.db)
      }
      /* 如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件 */
      request.onupgradeneeded = (event: any) => {
        this.db = event?.target?.result
        /* 新建表 */
        if (this.db && !this.db.objectStoreNames.contains(tableName)) {
          this.db.createObjectStore(tableName, {
            // keyPath: 'id',
            autoIncrement: true,
          })
        }
      }
    })
  }

  async add(value: any, key?: IDBValidKey | undefined) {
    await this.connections()
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('数据库实例不存在')
      const request = this.db
        .transaction([this.tableName], 'readwrite')
        .objectStore(this.tableName)
        .add(value, key)
      request.onsuccess = function (_event) {
        resolve(_event)
      }
      request.onerror = function (_event) {
        reject('数据写入失败')
      }
    })
  }

  async read(query: IDBValidKey | IDBKeyRange) {
    await this.connections()
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('数据库实例不存在')
      const transaction = this.db.transaction([this.tableName])
      const objectStore = transaction.objectStore(this.tableName)
      const request = objectStore.get(query)

      request.onerror = function (_event) {
        reject('事务失败')
      }
      request.onsuccess = function (_event) {
        if (request.result) {
          resolve(request.result)
        } else {
          reject('未获得数据记录')
        }
      }
    })
  }

  async readAll() {
    await this.connections()
    return new Promise<any[]>((resolve, reject) => {
      if (!this.db) return reject('数据库实例不存在')
      const objectStore = this.db
        .transaction(this.tableName)
        .objectStore(this.tableName)
      const sourceData: any[] = []

      objectStore.openCursor().onsuccess = function (event: any) {
        const cursor = event?.target?.result
        if (cursor) {
          sourceData.push(cursor?.value || {})
          cursor.continue()
        } else {
          resolve(sourceData)
        }
      }
    })
  }

  async update(value: any, key?: IDBValidKey | undefined) {
    await this.connections()
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('数据库实例不存在')
      const request = this.db
        .transaction([this.tableName], 'readwrite')
        .objectStore(this.tableName)
        .put(value, key)
      request.onsuccess = function (_event) {
        resolve('数据更新成功')
      }
      request.onerror = function (_event) {
        reject('数据更新失败')
      }
    })
  }

  async remove(key: IDBValidKey | IDBKeyRange) {
    await this.connections()
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('数据库实例不存在')
      const request = this.db
        .transaction([this.tableName], 'readwrite')
        .objectStore(this.tableName)
        .delete(key)
      request.onsuccess = function (_event) {
        resolve('数据删除成功')
      }
    })
  }
}

/* const indexedDB = new IndexedDB()
indexedDB.readAll().then((res) => {
  console.log(res)
}) */
