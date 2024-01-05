package it.unipi.dii.aide.lsmd.readrumble.config.database;

import com.mongodb.MongoClientSettings;
import com.mongodb.client.*;
import com.mongodb.ConnectionString;
import org.bson.Document;

public final class MongoConfig {
  private static final String protocol = "mongodb";
  private static final String hostname = "localhost";
  private static final String port = "27017";
  private static final String dbName = "readrumbleDB";
  private static final String options = null;
  private static MongoClient conn  = null;

  /**
  *private constructor for avoid instantiation
   */
  private MongoConfig() {}
  /**
   * function for create mongodb connection
   */
  private static void makeConnection() {

      ConnectionString cs = new ConnectionString(protocol + "://" + hostname + ":" + port + "/" );
      conn = MongoClients.create(
              MongoClientSettings.builder()
                      .applyConnectionString(cs)
                      .build()
      );

  }

     /**
      * function to retrieve the current state of the connection, if the connection has not yet been made it creates it
      * @return conn
      */
  private static MongoClient getConnection() {
          if(conn == null)
              makeConnection();
          return conn;
  }

     /**
      * function returns the connection to a given collection
      * @param collectionName
      * CollectionName is the name of collection that we need to use
      * @return MongoCollection<Document>
      * we return the connection to the collection for make the CRUD operation
      */
  public static MongoCollection<Document> getCollection(String collectionName) {

         MongoDatabase database = getConnection().getDatabase(dbName);
         return database.getCollection(collectionName);
     }

     /**
      * function to close the connection
      */
  public static void closeConnection() {
      System.out.println("close connection");
      if (conn != null) {
          conn.close();
          conn = null;
      }
  }

}
