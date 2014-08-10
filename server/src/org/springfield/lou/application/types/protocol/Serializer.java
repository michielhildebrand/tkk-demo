package org.springfield.lou.application.types.protocol;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;

public class Serializer {
    private static Gson plainGson = new GsonBuilder().disableHtmlEscaping().create();
    private static Gson prettyGson = new GsonBuilder().disableHtmlEscaping().setPrettyPrinting().create();

    public static String toJson(Message o) {
        return toJson(o, false);
    }

    public static String toJson(Message o, boolean pretty) {
        ByteArrayOutputStream bo = new ByteArrayOutputStream();
        try {
            Writer stringWriter = new OutputStreamWriter(bo, "UTF-8");
            if (pretty) {
                prettyGson.toJson(o, stringWriter);
            } else {
                plainGson.toJson(o, stringWriter);
            }
            stringWriter.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return bo.toString();
    }

    public static Message fromJson(String s) {
        return plainGson.fromJson(s, Message.class);
    }
}
