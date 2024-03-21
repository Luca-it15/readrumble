package org.example;

import java.util.ArrayList;
import java.util.List;

/**
 * Hello world!
 *
 */
public class App 
{
    public static void main( String[] args )
    {
       Nodo a = new Nodo('A', 5);
       Nodo b = new Nodo('B', 6);
       Nodo c = new Nodo('C', 5);
       Nodo d = new Nodo('D', 6);
       Nodo e = new Nodo('E', 5);
       Nodo f = new Nodo('F', 6);

       a.addNode(b);
       a.addNode(c);
       a.addNode(d);
       a.addNode(e);
       a.addNode(f);
       b.addNode(d);

       Grafo G = new Grafo();
       G.aggiungi(a);
       G.vicini(a);
       G.vicini(b);
       G.rimuovi(a);
       G.rimuovi(a);




    }
}
