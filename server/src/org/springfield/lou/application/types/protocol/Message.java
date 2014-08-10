package org.springfield.lou.application.types.protocol;

public class Message {
    private String target;
    private Object data;

    public Message(String target, Object data) {
        this.target = target;
        this.data = data;
    }

    public String getTarget() {
        return target;
    }

    public Object getData() {
        return data;
    }
}
