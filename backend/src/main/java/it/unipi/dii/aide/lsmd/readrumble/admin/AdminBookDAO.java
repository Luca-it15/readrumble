package it.unipi.dii.aide.lsmd.readrumble.admin;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import it.unipi.dii.aide.lsmd.readrumble.config.database.Neo4jConfig;
import org.bson.Document;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import it.unipi.dii.aide.lsmd.readrumble.book.Book;
import org.bson.conversions.Bson;
import org.neo4j.driver.Session;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

public class AdminBookDAO {

    private static List<Book> bookToAdd;
    private static List<Document> bookToUpdate;
    private static List<Long> bookToRemove;
    private final MongoCollection<Document> collection = MongoConfig.getCollection("Books");

    public ResponseEntity<String> addBookTemp(Book book) {
        if(bookToAdd == null)
            bookToAdd = new ArrayList<>();
        bookToAdd.add(book);
        return ResponseEntity.ok("book will add");
    }

    public ResponseEntity<String> updateBookTemp(Document update) {
        if(bookToUpdate == null)
            bookToUpdate = new ArrayList<>();
        bookToUpdate.add(update);
        return ResponseEntity.ok("book will update");
    }

    public ResponseEntity<String> removeBookTemp(long id) {
        if(bookToRemove == null)
            bookToRemove = new ArrayList<>();
        return ResponseEntity.ok("book will remove");
    }

    public void removeBook() {

        if(bookToRemove.isEmpty())
            return;

        Bson filter = Filters.in("_id", bookToRemove);

        DeleteResult result = collection.deleteMany(filter);

        try (Session session = Neo4jConfig.getSession()) {
            List<String> idStrings = bookToRemove.stream().map(Object::toString).collect(Collectors.toList());
            String query = String.format("MATCH (l:Libro) WHERE l.id IN %s DETACH DELETE l", idStrings);
            session.run(query);
        }

        bookToRemove.clear();

        if (result.wasAcknowledged())
            System.out.println("book remove successfull: book removed" + result.getDeletedCount());
        else
           System.err.println("failed to remove the book: book removed" + result.getDeletedCount());
    }

    public void addBook() {

        if(bookToAdd.isEmpty())
            return;

        List<Document> bookAdd = new ArrayList<>();
        for (Book book : bookToAdd) {

            Instant instant = Instant.now();
            long timestamp = instant.toEpochMilli();
            Document document = new Document("_id", timestamp)
                    .append("isbn", book.getIsbn())
                    .append("description", book.getDescription())
                    .append("link", book.getLink())
                    .append("authors", book.getAuthors())
                    .append("publisher", book.getPublisher())
                    .append("num_pages", book.getNum_pages())
                    .append("publication_year", book.getPublication_year())
                    .append("url", book.getUrl())
                    .append("image_url", book.getImage_url())
                    .append("title", book.getTitle())
                    .append("tags", book.getTags());

            bookAdd.add(document);
        }
        collection.insertMany(bookAdd);

        try (Session session = Neo4jConfig.getSession()) {

            for (int i = 0; i < bookToAdd.size(); i++) {
                String query = String.format("CREATE (l:Libro {id: '%s', title: '%s'})", bookAdd.get(i).getLong("_id"), bookAdd.get(i).getString("title"));
                session.run(query);
            }
        }
        bookToAdd.clear();
       System.out.println("book add successfull");
    }

    public void updateBook() {

        if(bookToUpdate.isEmpty())
            return;

        String result = null;
        for (Document changes : bookToUpdate) {

            int new_field_int = 0;
            String new_field_String = null;
            List<String> new_field_list = new ArrayList<>();
            int index = 0;
            String type_of_change_request = changes.getString("type_of_change_request");
            if (type_of_change_request.equals("num_pages") || type_of_change_request.equals("publication_year")) {
                new_field_int = changes.getInteger("new_field");
            } else if (type_of_change_request.equals("tags") || type_of_change_request.equals("authors")) {
                new_field_list = (List<String>) changes.get("new_field");
                index = 1;

            } else {
                new_field_String = changes.getString("new_field");
                index = 2;
            }
            long id_to_use = Long.parseLong(changes.getString("id_to_use"));
            MongoCollection<Document> collection = MongoConfig.getCollection("Books");
            Document book = collection.find(eq("_id", id_to_use)).first();

            try {
                if (book != null) {
                    switch (index) {
                        case 0:
                            collection.updateOne(eq("_id", id_to_use), set(type_of_change_request, new_field_int));
                            result = type_of_change_request + " Changed in " + new_field_int;
                            break;
                        case 1:
                            collection.updateOne(eq("_id", id_to_use), set(type_of_change_request, new_field_list));
                            result = (String) type_of_change_request + " Changed in " + new_field_list;
                            break;
                        default:
                            collection.updateOne(eq("_id", id_to_use), set(type_of_change_request, new_field_String));
                            result = (String) type_of_change_request + " Changed in " + new_field_String;
                            if(type_of_change_request.equals("title")) {
                                try (Session session = Neo4jConfig.getSession()) {
                                    String query = String.format("CREATE (l:Libro {id: '%s', titolo: '%s'})",id_to_use,new_field_String );
                                    session.run(query);
                                }
                            }
                    }

                } else {
                    result = "NOT FOUND";
                }
            } catch (Exception e) {
                System.err.println("EXCEPTION IN SERVER");
                return;
            }

        }
        bookToUpdate.clear();
        System.out.println(result);
    }
}
