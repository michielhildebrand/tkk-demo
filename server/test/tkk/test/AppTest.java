package tkk.test;

import org.junit.Test;
import org.springfield.lou.application.types.VideoLoader;
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
//        Episode e = new Episode("8a8187f2-3fc8-cb54-0140-7dd099380002");
//        Episode e = new Episode("8a8187f2-3fc8-cb54-0140-7dd151100003");
//        Episode e = new Episode("8a8187f2-3fc8-cb54-0140-7dd247360004");
//        Episode e = new Episode("8a8187f2-3fc8-cb54-0140-7dd2d0650005");
//        Episode e = new Episode("c44643ee-823e-476c-a099-bd28bcf1e56a");

//        Episode e = ch.getLatestEpisode(); //UnknownHostException: api.linkedtv.eu

//        Channel ch = new Channel("linkedtv", "rbb");
//        Channel ch = new Channel("linkedtv", "S%26V");

//        List<Episode> curatedEpisodes = ch.getEpisodes();
//        System.out.println("curatedEpisodes.size() = " + curatedEpisodes.size()); //0 for S&V, 1 for rbb

        Message msg = new Message("video", new VideoLoader().getRecentVideos());
        System.out.println(Serializer.toJson(msg));

        assertTrue(true);
    }

}
