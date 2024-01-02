package com.readrumble.massi.backend.part;


// ClientApplication.java
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class ClientApplication {
    public static void main(String[] args) throws Exception {
        Integer i = 0;
        Scanner comando = new Scanner(System.in);
        Scanner scanner = new Scanner(System.in);
        String vuoto = "[]";
        while(i != 1)
        {
            System.out.println("Ciao ! ecco cosa puoi fare qui: ");
            System.out.println("0 : registrati");
            System.out.println("1 : esci dall'applicazione");
            System.out.println("2 : vedi l'utente di cui specifichi il nome");
            System.out.println("3 : loggati");
            i = comando.nextInt();
            System.out.println("ecco il numero " + i);
            if(i == 0)
            {
                // Chiedi all'utente di inserire la stringa di ricerca
                System.out.println("Inserisci nome, cognome, username e password per registrarti: ");
                String paramNome = scanner.nextLine();
                String paramCognome = scanner.nextLine();
                String paramUsername = scanner.nextLine();
                String paramPassword = scanner.nextLine();
                System.out.println(paramNome+" "+paramCognome+" "+paramUsername+" "+paramPassword);
                Utente utente = new Utente();

                utente.setSurname(paramCognome);
                utente.setUsername(paramUsername);
                utente.setPassword(paramPassword);
                utente.setName(paramNome);
                System.out.println(utente);
                System.out.println(utente.getName());
                // Configura l'URL del server
                String serverUrl = "http://localhost:8080";
                String endpoint = "/api/registration";
                // Sostituisci con il valore desiderato

                // Modifica l'URL della richiesta con il parametro di ricerca
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(serverUrl + endpoint))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(new ObjectMapper().writeValueAsString(utente), StandardCharsets.UTF_8))
                        .build();


                HttpClient httpClient = HttpClient.newHttpClient();
                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                // Stampa la risposta
                System.out.println("Risposta dal server: " + response.body());

                if(vuoto.equals(response.body()))
                {
                    System.out.println("OH NO, Il file è vuoto !");
                }
            }
            else if(i == 2)
            {
                System.out.print("Inserisci il nome per la ricerca: ");
                String paramNome = scanner.nextLine();

                // Configura l'URL del server

                String serverUrl = "http://localhost:8080";
                String endpoint = "/api/dati";
                String queryParams = String.format("?nome=%s", URLEncoder.encode(paramNome, StandardCharsets.UTF_8));

                URI uri = URI.create(serverUrl + endpoint + queryParams);

                // Esegui la richiesta GET
                HttpClient httpClient = HttpClient.newHttpClient();
                HttpRequest request = HttpRequest.newBuilder().uri(uri).build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());


                // Stampa la risposta
                System.out.println("Risposta dal server: " + response.body());

            }
            else if(i == 3)
            {
                System.out.print("Inserisci username e password: ");
                String usrnm = scanner.nextLine();
                String pwd = scanner.nextLine();
                // Configura l'URL del server

                String serverUrl = "http://localhost:8080";
                String endpoint = "/api/login";
                String queryParams = String.format("?username=%s&password=%s", URLEncoder.encode(usrnm, StandardCharsets.UTF_8),URLEncoder.encode(pwd, StandardCharsets.UTF_8));

                URI uri = URI.create(serverUrl + endpoint + queryParams);

                // Esegui la richiesta GET
                HttpClient httpClient = HttpClient.newHttpClient();
                HttpRequest request = HttpRequest.newBuilder().uri(uri).build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());


                // Stampa la risposta

                if("isLogged".equals(response.body()))
                {
                    System.out.println("hai loggato con successo!");
                }
                else
                {
                    System.out.println(response.body());
                }

            }
        }
        scanner.close();
        comando.close();

    }
}