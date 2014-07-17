package org.springfield.lou.application.types;

import com.google.gson.Gson;

import java.io.*;

public class Message {
    private String target;
    private Object data;

    public Message(String target, Object data) {
        this.target = target;
        this.data = data;
    }

    public String toJson() {
        ByteArrayOutputStream bo = new ByteArrayOutputStream();
        try {
            Writer stringWriter = new OutputStreamWriter(bo, "UTF-8");
            new Gson().toJson(this, stringWriter);
            stringWriter.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return bo.toString();
    }
}
