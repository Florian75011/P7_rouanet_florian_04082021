import mysql2 from "mysql2";

// Base de donnée MYSQL
function getConnection() {
    const connection = mysql2.createConnection({
        host: 'remotemysql.com',
        user: 'ETNYDzcq3G',
        database: 'ETNYDzcq3G',
        password: '4mhonqgKWP'
      });
    return connection
}

export default getConnection