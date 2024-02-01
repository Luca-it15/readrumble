package it.unipi.dii.aide.lsmd.readrumble;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class
ReadrumbleApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReadrumbleApplication.class, args);
    }
}
