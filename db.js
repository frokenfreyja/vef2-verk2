const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/freyja';// sótt úr env gegnum dotenv pakka

/* todo útfæra */

async function saveToDb(data) {
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'INSERT INTO applications(name, email, phone, presentation, job) VALUES($1, $2, $3, $4, $5)';
  const values = [data.name, data.email, data.phone, data.presentation, data.job];

  try {
    await client.query(query, values);
  } catch (err) {
    console.error('Error inserting data');
    throw err;
  } finally {
    await client.end();
  }
}

async function processApplication(data) {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    await client.query('UPDATE applications SET processed = TRUE WHERE id = '+data);
  } catch (err) {
    console.error('Error processing data');
    throw err;
  } finally {
    await client.end();
  }
}

async function updateTime(data) {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    await client.query('UPDATE applications SET updated = current_timestamp WHERE id = '+data);
  } catch (err) {
    console.error('Error processing data');
    throw err;
  } finally {
    await client.end();
  }
}


async function removeFromDb(data) {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    await client.query('DELETE FROM applications WHERE id = '+data);
  } catch (err) {
    console.error('Error deleting data');
    throw err;
  } finally {
    await client.end();
  }
}

async function fetchData() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query('SELECT * FROM applications ORDER BY id');

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error selecting form data');
    throw err;
  } finally {
    await client.end();
  }
}

async function runQuery(query) {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query(query);

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

module.exports = {
  saveToDb,
  processApplication,
  updateTime,
  removeFromDb,
  fetchData,
  runQuery,
};
