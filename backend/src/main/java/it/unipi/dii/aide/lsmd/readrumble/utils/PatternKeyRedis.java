package it.unipi.dii.aide.lsmd.readrumble.utils;

import redis.clients.jedis.ConnectionPool;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.params.ScanParams;
import redis.clients.jedis.resps.ScanResult;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class PatternKeyRedis {
    public static Set<String> scanNode(Jedis node, String pattern) {
        Set<String> result = new HashSet<>();
        ScanParams scanParams = new ScanParams().match(pattern);
        String cursor = ScanParams.SCAN_POINTER_START;
        do {
            ScanResult<String> scanResult = node.scan(cursor, scanParams);
            List<String> keys = scanResult.getResult();
            if(!keys.isEmpty())
            {
                for(String key : keys)
                {
                    result.add(key);
                }

            }
            cursor = scanResult.getCursor();
        } while (!cursor.equals(ScanParams.SCAN_POINTER_START));
        return result;
    }
    public static Set<String> KeysTwo(JedisCluster cluster, String pattern) {
        Set<String> result = new HashSet<>();
        for (ConnectionPool node : cluster.getClusterNodes().values()) {
            try (Jedis j = new Jedis(node.getResource())) {
                result.addAll(scanNode(j,pattern)); // Single node scan from earlier example
            }
        }
        return result;
    }
}
