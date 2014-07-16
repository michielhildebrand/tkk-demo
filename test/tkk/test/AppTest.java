package tkk.test;

import org.junit.Test;
import org.springfield.lou.application.types.DomainUtil;
import org.springfield.mojo.linkedtv.Episode;

import static org.junit.Assert.assertTrue;

public class AppTest {

    @Test
    public void checkEpisode() {
        Episode e = new Episode("8a8187f2-3fc8-cb54-0140-7dccd76f0001");

        DomainUtil.printEpisodeAnnotations(e);

        assertTrue(true);
    }

}
