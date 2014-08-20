package tkk.test;

import org.junit.Test;
import org.springfield.lou.application.types.domain.Video;
import org.springfield.lou.application.types.protocol.Message;
import org.springfield.lou.application.types.protocol.Serializer;
import org.springfield.mojo.linkedtv.Channel;
import org.springfield.mojo.linkedtv.Episode;

import java.util.List;

import static org.junit.Assert.assertTrue;

public class AppTest {

    @Test
    public void checkEpisode() {
//        Episode e = new Episode("8a8187f2-3fc8-cb54-0140-7dccd76f0001");

        Channel ch = new Channel("linkedtv", "rbb");
//        Channel ch = new Channel("linkedtv", "S%26V");

//        Episode e = ch.getLatestEpisode(); //UnknownHostException: api.linkedtv.eu

        List<Episode> curatedEpisodes = ch.getEpisodes();
        System.out.println("curatedEpisodes.size() = " + curatedEpisodes.size()); //0 for S&V, 1 for rbb

//        Message msg = new Message("", new Video(e));
        Message msg = new Message("", new Video(curatedEpisodes.get(0)));
        System.out.println(Serializer.toJson(msg));

        assertTrue(true);
    }

}
