import db from "./db.js";
import bcrypt from "bcrypt";

const createUser = async (name, email, passwordHash) => {
  const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        SELECT $1, $2, $3, role_id
        FROM roles
        WHERE role_name = $4
        RETURNING user_id
        `;

  const queryParams = [name, email, passwordHash, "user"];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create user: default role not found");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new user with ID:", result.rows[0].user_id);
  }

  return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
  const query = `
        SELECT user_id, name, email, password_hash, role_id 
        FROM users 
        WHERE email = $1
    `;
  const queryParams = [email];

  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    return null; // User not found
  }

  return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email); 
    if (!user) {
        return null;
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
        return null;
    }

    const userWithoutPasswordHash = { ...user };
    delete userWithoutPasswordHash.password_hash;

    return userWithoutPasswordHash;

};

export { createUser, authenticateUser };
