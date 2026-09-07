import { Pool } from "pg";

/**
 * Connection pool for PostgreSQL database.
 *
 * A connection pool maintains a set of reusable database connections
 * to avoid the overhead of creating new connections for each request.
 * This improves performance and reduces load on the database server.
 *
 * Uses a connection string from environment variables for simplified setup.
 * The connection string format is:
 * postgresql://username:password@host:port/database
 */
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: true,     /** esta linea sirve para encriptar la comunicacion porque va como texto plano */
});

/**
 * Common SSL Issue:
 *
 * You may encounter SSL connection errors depending on your operating system, Node.js
 * version, or PostgreSQL server settings. If you have confirmed your credentials are
 * correct but still see SSL errors, try updating the 'ssl' property in the Pool
 * configuration above to:
 *
 * ssl: {
 *     rejectUnauthorized: false
 * }
 */

/**
 * Since we will modify the normal pool object in development mode, we need to create and
 * export a reference to the pool object. This allows us to use the same name for the
 * export regardless of whether we are in development or production mode.
 */
let db = null;

if (
    process.env.NODE_ENV === "development" && 
    process.env.ENABLE_SQL_LOGGING === "true"
) {
    /**
   * In development mode, we wrap the pool to provide query logging.
   * This helps with debugging by showing all executed queries in the console.
   *
   * The wrapper also adds timing information to help identify slow queries
   * and tracks the number of rows affected by each query.
   */
    db = {
    async query(text, params) {
        try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log("Executed query:", {
            text: text.replace(/\s+/g, " ").trim(),  /** \s: (tabulaciones \t y saltos de linea \n) \g: global, o sea, en todo el texto*/
            duration: `${duration}ms`,
            rows: res.rowCount,
        });
        return res;
        } catch (error) {
        console.error("Error in query:", {
            text: text.replace(/\s+/g, " ").trim(),
            error: error.message,
        });
        throw error;
        }
    },

    async close() {
        await pool.end();
    },
    };
} else {
  // In production, export the pool directly without logging overhead
    db = pool;
}

/**
 * Tests the database connection by executing a simple query.
 */
const testConnection = async () => {
    try {
    const result = await db.query("SELECT NOW() as current_time");  /**SELECT NOW() es una SQL query. Devuelve la hora del servidor */
    console.log("Database connection successful:", result.rows[0].current_time);
    return true;
    } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
    }
};

export { db as default, testConnection };
