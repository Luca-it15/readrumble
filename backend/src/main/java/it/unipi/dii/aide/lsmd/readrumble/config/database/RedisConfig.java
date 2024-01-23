package it.unipi.dii.aide.lsmd.readrumble.config.database;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

public class RedisConfig {
    private static final String HOST = "localhost";
    private static final int PORT = 6379;
    private static Jedis conn = null;

    /**
     * Private constructor to avoid instantiation
     */
    private RedisConfig() {

    }

    /**
     * Function to create Redis connection
     */
    private static void makeConnection() {
        JedisPool pool = new JedisPool(HOST, PORT);
        conn = pool.getResource();
    }

    /**
     * Function to retrieve the current state of the connection, if the connection has not yet been made it creates it
     *
     * @return session
     */
    public static Jedis getSession() {
        if (conn == null) makeConnection();
        return conn;
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
