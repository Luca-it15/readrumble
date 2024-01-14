package it.unipi.dii.aide.lsmd.readrumble.config.database;

import org.neo4j.driver.*;

public final class Neo4jConfig {
    private static final String URI = "bolt://localhost:7687";
    private static final String USERNAME = "neo4j";
    private static final String PASSWORD = "password1";
    private static final String DATABASE = "readrumble";
    private static Driver conn = null;

    /**
     * Private constructor to avoid instantiation
     */
    private Neo4jConfig() {
    }

    /**
     * Function to create Neo4j connection
     */
    private static void makeConnection() {
        conn = GraphDatabase.driver(URI, AuthTokens.basic(USERNAME, PASSWORD));
    }

    /**
     * Function to retrieve the current state of the connection, if the connection has not yet been made it creates it
     *
     * @return session
     */
    public static Session getSession() {
        if (conn == null) makeConnection();
        return conn.session(SessionConfig.forDatabase(DATABASE));
    }

    /**
     * Function to close the connection
     */
    public static void closeConnection() {
        System.out.println("close connection");
        if (conn != null) {
            conn.close();
            conn = null;
        }
    }
}
