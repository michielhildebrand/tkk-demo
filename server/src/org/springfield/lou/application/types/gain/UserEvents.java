package org.springfield.lou.application.types.gain;

import org.springfield.lou.application.types.protocol.Message;
import org.springfield.mojo.linkedtv.GAIN;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class UserEvents {
    private BlockingQueue<Message> queue;
    private GAIN tracker;

    public UserEvents(int maxCapacity) {
        queue = new ArrayBlockingQueue<Message>(maxCapacity);
        tracker = new GAIN("LINKEDTV-TEST", "Culture");

        // run the consumer thread, there could be more than one consumer
        Thread th = new Thread(new QueueProcessor(), "QueueProcessor");
        th.setDaemon(true); // don't hold the VM open for this thread
        th.start();
    }

    public void put(Message msg) {
        try {
            queue.put(msg);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private class QueueProcessor implements Runnable {
        @Override
        public void run() {
            try {
                while (!Thread.currentThread().isInterrupted()) {
                    Message msg = queue.take();
                    // TODO and now we send the event using the tracker
                    System.out.println("Consuming msg = " + msg);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

}