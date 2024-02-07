package it.unipi.dii.aide.lsmd.readrumble.utils;

import redis.clients.jedis.ConnectionPool;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.params.ScanParams;
import redis.clients.jedis.resps.ScanResult;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class PatternKeyRedis {
    public static List<String> KeysTwo(JedisCluster cluster, String pattern) {
        List<String> result = new ArrayList<>();
        for (ConnectionPool node : cluster.getClusterNodes().values()) {
            Jedis jedisNode = new Jedis(node.getResource());
            ScanParams scanParams = new ScanParams().match(pattern).count(2000);
            String cursor = ScanParams.SCAN_POINTER_START;
            do {
                ScanResult<String> scanResult = jedisNode.scan(cursor, scanParams);
                result.addAll(scanResult.getResult());
                cursor = scanResult.getCursor();
            } while (!cursor.equals(ScanParams.SCAN_POINTER_START));
        }
        return result;
    }
}
