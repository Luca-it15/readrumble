package it.unipi.dii.aide.lsmd.readrumble.data_migration;

import it.unipi.dii.aide.lsmd.readrumble.config.database.MongoConfig;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoCollection;

import org.bson.Document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class ActiveBooksMonthlyInitializer {
    private Logger logger = LoggerFactory.getLogger(ActiveBooksMonthlyInitializer.class);

    private List<Document> generatePipeline() {
        int month = LocalDate.now().getMonthValue();
        int year = LocalDate.now().getYear();

        int previousMonth, previousYear;

        if (month == 1) {
            previousMonth = 12;
            previousYear = year - 1;
        } else {
            previousMonth = month - 1;
            previousYear = year;
        }

        List<Document> pipeline = new ArrayList<>();

        pipeline.add(new Document("$match", new Document("month", previousMonth).append("year", previousYear)));
        pipeline.add(new Document("$unwind", "$books"));
        pipeline.add(new Document("$match", new Document("books.bookmark", new Document("$ne", "$books.num_pages"))));
        pipeline.add(new Document("$group", new Document("_id", "$username")
                .append("books", new Document("$addToSet", "$$ROOT"))));
        pipeline.add(new Document("$addFields", new Document("month", month).append("year", year)));
        pipeline.add(new Document("$project", new Document("username", "$_id")
                .append("year", "$year")
                .append("month", "$month")
                .append("books", new Document("$map", new Document("input", "$books")
                        .append("as", "book")
                        .append("in", new Document("book_id", "$$book.books.book_id")
                                .append("book_title", "$$book.books.book_title")
                                .append("num_pages", "$$book.books.num_pages")
                                .append("bookmark", "$$book.books.bookmark")
                                .append("pages_read", 0)
                                .append("tags", "$$book.books.tags")
                                .append("state", "$$book.books.state"))))));
        pipeline.add(new Document("$unset", "_id"));
        pipeline.add(new Document("$merge", "ActiveBooks"));

        return pipeline;
    }

    // Every first day of the month at 00:00
    @Scheduled(cron = "0 0 0 1 * *")
    public void monthlyInitializer() {
        logger.info("Monthly update of ActiveBooks started");

        MongoCollection<Document> collectionActiveBooks = MongoConfig.getCollection("ActiveBooks");

        AggregateIterable<Document> result = collectionActiveBooks.aggregate(generatePipeline()).allowDiskUse(true);

        result.forEach(document -> {});

        logger.info("Monthly update of ActiveBooks finished");
    }
}