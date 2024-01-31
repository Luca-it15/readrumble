package it.unipi.dii.aide.lsmd.readrumble.utils;

public enum Status {
    IN_READING(0), FINISHED(1);

    private final int value;

    Status(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
    }