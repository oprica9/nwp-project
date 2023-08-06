package com.raf.rs.nwp.utils;

import java.time.Instant;
import java.util.Random;

public class DelayUtils {

    public static Instant getDelay(long baseDelayMillis, long randomMaxMillis) {
        long totalDelay = baseDelayMillis + new Random().nextInt((int) randomMaxMillis);
        return Instant.now().plusMillis(totalDelay);
    }
}
