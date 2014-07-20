package org.springfield.lou.application.types.protocol;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;

public class Serializer {
    public static String toJson(Object o) {
        return toJson(o, false);
    }

    public static String toJson(Object o, boolean pretty) {
        ByteArrayOutputStream bo = new ByteArrayOutputStream();
        try {
            Writer stringWriter = new OutputStreamWriter(bo, "UTF-8");
            Gson g;
            if (pretty) {
                g = new GsonBuilder().setPrettyPrinting().create();
            } else {
                g = new Gson();
            }
            g.toJson(o, stringWriter);
            stringWriter.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return bo.toString();
    }
}
