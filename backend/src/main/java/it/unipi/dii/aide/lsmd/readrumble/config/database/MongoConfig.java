package it.unipi.dii.aide.lsmd.readrumble.config.database;

import com.mongodb.MongoClientSettings;
import com.mongodb.client.*;
import com.mongodb.ConnectionString;
import org.bson.Document;

public final class MongoConfig {
    private static final String PROTOCOL = "mongodb";
    private static final String HOSTNAME = "10.1.1.43:27021, 10.1.1.44:27021, 10.1.1.45:27021";
    private static final String OPTION = "ReadRumbleDB?w=majority&readConcern=majority&readPreference=nearest";
    private static final String DATABASE = "ReadRumbleDB";
    private static MongoClient conn = null;

    /**
     * Function to create Mongo connection
     */
    private static void makeConnection() {
        ConnectionString cs = new ConnectionString(PROTOCOL + "://" + HOSTNAME + "/" + OPTION);
        conn = MongoClients.create(MongoClientSettings.builder().applyConnectionString(cs).build());
    }

    /**
     * Function to retrieve the current state of the connection, if the connection has not yet been made it creates it
     *
     * @return conn
     */
    private static MongoClient getConnection() {
        if (conn == null) makeConnection();
        return conn;
    }

    /**
     * This function returns the connection to a given collection
     *
     * @param collectionName CollectionName is the name of collection that we need to use
     * @return MongoCollection<Document>
     * we return the connection to the collection for make the CRUD operation
     */
    public static MongoCollection<Document> getCollection(String collectionName) {
        MongoDatabase database = getConnection().getDatabase(DATABASE);
        return database.getCollection(collectionName);
    }

    /**
     * Function to close the connection
     */
    public static void closeConnection() {
        System.out.println("Close connection");
        if (conn != null) {
            conn.close();
            conn = null;
        }
    }
}
