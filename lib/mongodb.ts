import mongoose from 'mongoose'
import config from 'config'
import logger from './logger'

export default class MongoConn {
    mongoConn: mongoose.Connection
    private static _instance: MongoConn

    constructor() {
        this.connectDB()
        this.mongoConn = mongoose.connection

        this.mongoConn.on('connected', () => {
          logger.info(`[MongoConn]: Connected to database ${config.get("mongodb.database")}`)
        })

        this.mongoConn.on('error', (err) => {
          logger.error(`[MongoConn]: Error in database connection - ${err.message}`);
          this.handleDBConnectionError(err);
        })
    }

    public static get instance() {
        return this._instance || ( this._instance = new this() )
    }

    public async connectDB() {
        mongoose.set('strictQuery', false)
        mongoose.set('bufferCommands', true)
        
        try {
            await mongoose.connect(
                `${config.get("mongodb.url")}/${config.get("mongodb.database")}`,
                config.get("mongodb.options"),
            )
        } catch( err ) {
            this.handleDBConnectionError(err)
        }
    }

    private handleDBConnectionError(error: any) {
        logger.error(`[MongoConn/connectDB]: Error in database connection - ${error.message}`);
    
        if (config.has('mongodb.retryInterval') && config.has('mongodb.maxRetries')) {
          const retryInterval: number = config.get('mongodb.retryInterval');
          const maxRetries: number = config.get('mongodb.maxRetries');
    
          logger.info(`[MongoConn/connectDB]: Retrying database connection in ${retryInterval} ms...`);
    
          setTimeout(async () => {
            if (maxRetries === -1 || maxRetries > 0) {
              if (maxRetries > 0) {
                const newMaxRetries = maxRetries - 1
                config.util.extendDeep(config, { mongodb: { maxRetries: newMaxRetries }})
              }
              await this.connectDB();
            } else {
              logger.error(`[MongoConn/connectDB]: Maximum retry attempts reached. Exiting application.`);
              process.exit(1);
            }
          }, retryInterval);
        } else {
          logger.error(`[MongoConn/connectDB]: Restarting the application due to database connection failure.`);
          process.exit(1);
        }
      }
}