import requests
import pandas as pd

def cerca_tutti_i_libri():
    indice_iniziale = 0
    libri = []

    while True:
        # Costruzione dell'URL della richiesta
        url = f"https://www.googleapis.com/books/v1/volumes?q=libro&maxResults=40&startIndex={indice_iniziale}"

        # Invio della richiesta
        risposta = requests.get(url)

        # Controllo dello stato della risposta
        if risposta.status_code == 200:
            # Conversione della risposta in JSON
            dati = risposta.json()

            # Aggiunta dei libri all'elenco
            libri.extend(dati["items"])

            # Controllo se ci sono altri libri
            if "items" in dati and len(dati["items"]) == 40:
                indice_iniziale += 40
            else:
                break
        else:
            print(f"Errore: {risposta.status_code}")
            break

    return libri

# Uso della funzione per cercare tutti i libri
libri = cerca_tutti_i_libri()

# Creazione di un DataFrame da salvare in un file Excel
df = pd.DataFrame(libri)

# Salvataggio del DataFrame in un file Excel
df.to_excel("libri.xlsx", index=False)
