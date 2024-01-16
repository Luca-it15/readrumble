package it.unipi.dii.aide.lsmd.readrumble.library;

import com.mongodb.client.MongoCollection;
import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;


public class LibraryBookDAO {

    List<LibraryBookDTO> getLibraryBooks(String username) {
        MongoCollection<Document> collection = MongoConfig.getCollection("ActiveBooks");
        //current year and month
        LocalDate current_date = LocalDate.now();
        int year = current_date.getYear();
        int month = current_date.getMonthValue();
        Document query = new Document("username", username)
                        .append("year", year).append("month", month);
        Document userDocument = collection.find(query).first();
        List<LibraryBookDTO> libraryBooks = new ArrayList<>();
        if (userDocument != null) {
            List<Document> books = (List<Document>) userDocument.get("books");
            for (Document book : books) {
                LibraryBookDTO lb = new LibraryBookDTO(
                        book.getInteger("book_id"),
                        book.getString("book_title")
                );
                libraryBooks.add(lb);
            }
        }
        MongoConfig.closeConnection();
        return libraryBooks;
    }

    Document getBook(String username, int book_id) {
        MongoCollection<Document> collection = MongoConfig.getCollection("ActiveBooks");
        Document query = new Document("username", username);
        Document userDocument = collection.find(query).first();
        Document lb = null;
        if (userDocument != null) {
            List<Document> books = (List<Document>) userDocument.get("books");
            for (Document book : books) {
                if(book_id == book.getInteger("book_id")) {
                    lb = book;
                    break;
                } else {
                    System.out.println("the book in the user library doesn't exist");
                }
            }

        }
        MongoConfig.closeConnection();
        return lb;
    }
}