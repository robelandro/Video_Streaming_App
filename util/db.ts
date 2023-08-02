import { connect } from 'mongoose';

const DBHOST: string = process.env.DBHOST || 'myatlasclusteredu.3n9yoh1.mongodb.net'; // define the host
const DBPWD: string = process.env.DBPWD || '1937456Nft'; // define the password
const DBUSERNAME: string = process.env.DBUSERNAME || 'myAtlasDBUser'; // define the username
const DBNAME: string = process.env.DBNAME || 'VideoStreaming'; // define the name of the database
const URL: string = `mongodb+srv://${DBUSERNAME}:${DBPWD}@${DBHOST}/${DBNAME}?retryWrites=true&w=majority`; // define the connection URL

/**
 * Connects to the database.
 * @returns {boolean} true if connection is successful
 * if connection is successful, returns boolean true
 */
export async function isAlive() : Promise<boolean> {
    try {
        await connect(URL);
        return true;
    }
    catch (error) {
        console.log('Unable to Connect\n');
        console.error(error);
        return false;
    }
}
