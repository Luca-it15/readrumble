package it.unipi.dii.aide.lsmd.readrumble;

import it.unipi.dii.aide.lsmd.readrumble.bean.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookRepository extends MongoRepository<Book, String> {
    @Override
    Page<Book> findAll(Pageable pageable);
}

