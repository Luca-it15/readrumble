package it.unipi.dii.aide.lsmd.readrumble.config.database;

import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.JedisCluster;

import java.util.HashSet;
import java.util.Set;

public class RedisClusterConfig {
    private static RedisClusterConfig instance;
    private JedisCluster jedisCluster;

    private RedisClusterConfig() {
        Set<HostAndPort> jedisClusterNodes = new HashSet<>();
        jedisClusterNodes.add(new HostAndPort("10.1.1.43", 7000));
        jedisClusterNodes.add(new HostAndPort("10.1.1.44", 7000));
        jedisClusterNodes.add(new HostAndPort("10.1.1.45", 7000));
        jedisCluster = new JedisCluster(jedisClusterNodes, 0);
    }

    public static synchronized RedisClusterConfig getInstance() {
        if (instance == null) {
            instance = new RedisClusterConfig();
        }
        return instance;
    }

    public JedisCluster getJedisCluster() {
        return jedisCluster;
    }
}

