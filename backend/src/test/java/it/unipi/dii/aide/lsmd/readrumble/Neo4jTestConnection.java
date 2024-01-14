package it.unipi.dii.aide.lsmd.readrumble;

import org.neo4j.driver.*;

public class Neo4jTestConnection {
    public static void main(String[] args) {
        Driver driver = null;
        try {
            driver = GraphDatabase.driver("bolt://localhost:7687", AuthTokens.basic("neo4j", "password1"));
            try (Session session = driver.session()) {
                Transaction tx = session.beginTransaction();
                Result result = tx.run("RETURN 'Hello, World!'");
                String greeting = result.single().get(0).asString();
                tx.commit();
                System.out.println(greeting);
            }
        } catch (Exception e) {
            System.out.println("Errore durante la connessione al database: " + e.getMessage());
        } finally {
            if (driver != null) {
                driver.close();
            }
        }
    }
}

