package tkk.test;

import org.junit.Test;
import org.springfield.lou.application.types.domain.Video;
import org.springfield.lou.application.types.protocol.Serializer;
import org.springfield.mojo.linkedtv.Episode;

import static org.junit.Assert.assertTrue;

public class AppTest {

    @Test
    public void checkEpisode() {
        Episode e = new Episode("8a8187f2-3fc8-cb54-0140-7dccd76f0001");

        Video v = Video.load(e);
        System.out.println("v = " + Serializer.toJson(v, true));

        assertTrue(true);
    }

}
