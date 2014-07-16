package org.springfield.lou.application.types;

import org.springfield.fs.FSList;
import org.springfield.fs.FsNode;
import org.springfield.mojo.linkedtv.Episode;

import java.util.List;

public class DomainUtil {

    public static void printEpisodeInfo(Episode e) {
        System.out.println("Episode(id: " + e.getMediaResourceId());
        System.out.println("Title: "+e.getTitle());
        System.out.println("Duration: "+e.getDuration());
        System.out.println("Stills uri: "+e.getStillsUri());
        System.out.println("Stream uri: "+e.getStreamUri());

    }

    public static void printEpisodeAnnotations(Episode e) {
        FSList annotations = e.getAnnotations();
        List<FsNode> annotationNodes = annotations.getNodes();
        if (annotationNodes != null) {
            for (FsNode node : annotationNodes) {
                System.out.println("node.asXML() = " + node.asXML());
                System.out.println("annotation " + node.getId() + ", start " + node.getProperty("starttime") + ", title " + node.getProperty("title"));
            }
        }
    }

    public static void printEpisodeChapters(Episode e) {
        FSList chapters = e.getChapters();
        List<FsNode> chaptersNode = chapters.getNodes();
        if (chaptersNode != null) {
            for (FsNode node : chaptersNode) {
                System.out.println("node.asXML() = " + node.asXML());
                System.out.println("chapter " + node.getId() + ", start " + node.getProperty("starttime") + ", title " + node.getProperty("title"));
            }

            //not there
            List<FsNode> locations = chapters.getNodesByName("location");
            if (locations != null) {
                for (FsNode location : locations) {
                    System.out.println("location : " + location.getProperty("name") + "(start: " + location.getProperty("starttime") + " duration: " + location.getProperty("duration") + ")");
                }
            }
        }
    }
}
