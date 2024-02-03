package it.unipi.dii.aide.lsmd.readrumble.utils;

import java.util.concurrent.Semaphore;

/**
 * pattern Singleton for Semaphore class
 */
public class SemaphoreRR {
    private static SemaphoreRR instance = null;
    private Semaphore semaphoreRR;

    private SemaphoreRR(int permits) {
        this.semaphoreRR = new Semaphore(permits);
    }

    public static synchronized SemaphoreRR getInstance(int permits) {
        if (instance == null) {
            instance = new SemaphoreRR(permits);
        }
        return instance;
    }

    public void acquire() throws InterruptedException{

            this.semaphoreRR.acquire();

    }

    public void release() {
        this.semaphoreRR.release();
    }
}
