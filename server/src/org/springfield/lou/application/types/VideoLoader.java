package org.springfield.lou.application.types;

import org.springfield.lou.application.types.domain.Video;
import org.springfield.mojo.linkedtv.Episode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class VideoLoader {
    private final static List<String> EpisodesId = Arrays.asList("8a8187f2-3fc8-cb54-0140-7dccd76f0001",
            "8a8187f2-3fc8-cb54-0140-7dd099380002", "8a8187f2-3fc8-cb54-0140-7dd151100003",
            "8a8187f2-3fc8-cb54-0140-7dd247360004");

    // 8a8187f2-3fc8-cb54-0140-7dd2d0650005 - Tussen Kunst - 560
    // This episode has only 1 chapter without any fragment (skipping)

    // c44643ee-823e-476c-a099-bd28bcf1e56a - Koninklijke Porceleyne Fles (Delft)
    // Fetching chapters for this episode results in a 500 (skipping)

    private List<Video> videos = new ArrayList<Video>();

    public VideoLoader() {
        for (String s : EpisodesId) {
            System.out.println("Fetching episode = " + s);
            videos.add(new Video(new Episode(s)));
        }
    }

    public List<Video> getRecentVideos() {
        return videos;
    }

    public String getOfflineRecentVideos() {
        return "{\n" +
                "  \"target\": \"video\",\n" +
                "  \"data\": [\n" +
                "    {\n" +
                "      \"id\": \"8a8187f2-3fc8-cb54-0140-7dccd76f0001\",\n" +
                "      \"title\": \"Tussen Kunst - 640\",\n" +
                "      \"shots\": \"http://tkk.dev/video/shots/1\",\n" +
                "      \"poster\": \"http://tkk.dev/video/shots/1/h/0/m/0/sec10.jpg\",\n" +
                "      \"src\": \"http://tkk.dev/video/raw.mp4\",\n" +
                "      \"duration\": 2949590,\n" +
                "      \"chapters\": [\n" +
                "        {\n" +
                "          \"id\": \"2\",\n" +
                "          \"duration\": \"180000.0\",\n" +
                "          \"title\": \"Introduction\",\n" +
                "          \"startTime\": 0,\n" +
                "          \"fragments\": [\n" +
                "            {\n" +
                "              \"id\": \"0a201ce2-eca0-11e3-a276-005056a7235c\",\n" +
                "              \"locator\": \" http://nl.dbpedia.org/resource/Nelleke_van_der_Krogt\",\n" +
                "              \"duration\": \"298000.0\",\n" +
                "              \"title\": \"Nelleke van der Krogt\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 1000,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"4ae7487e-f6df-11e3-87f6-005056a7235c\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"290000.0\",\n" +
                "              \"title\": \"Tin coffee decanter\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 5000,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"59198c4a-f6df-11e3-a577-005056a7235c\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"280000.0\",\n" +
                "              \"title\": \"A tin coffee decanter\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 10000,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"64453d94-f6df-11e3-9ad4-005056a7235c\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"240000.0\",\n" +
                "              \"title\": \"A tin coffee decanter\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 30000,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"7ef7e878-eca1-11e3-99e1-005056a7235c\",\n" +
                "              \"locator\": \"http://nl.dbpedia.org/resource/Nelleke_van_der_Krogt\",\n" +
                "              \"duration\": \"11000.0\",\n" +
                "              \"title\": \"Nelleke van der Krogt\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 44000,\n" +
                "              \"enrichments\": [\"https://www.youtube.com/watch?v=uD0ot1ccbZw\", \"http://avro.nl/tussenkunstenkitsch/over/nelleke_van_der_krogt.aspx\"]\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"4c9f6450-eca1-11e3-acd4-005056a7235c\",\n" +
                "              \"locator\": \"http://nl.dbpedia.org/resource/Museum_Martena\",\n" +
                "              \"duration\": \"37000.0\",\n" +
                "              \"title\": \"Museum Martena\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 56000,\n" +
                "              \"enrichments\": [\"https://de.foursquare.com/v/museum-martena-franeker-frysl%C3%A2n/4c628a0769a1c9b6cccc38a4\"]\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"361cba9e-eca0-11e3-89e2-005056a7235c\",\n" +
                "              \"locator\": \"http://nl.dbpedia.org/resource/Franeker\",\n" +
                "              \"duration\": \"3200.0046\",\n" +
                "              \"title\": \"Franeker\",\n" +
                "              \"type\": \"Location\",\n" +
                "              \"startTime\": 69919,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"0a01e4d0-f172-11e3-8114-005056a7235c\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"125000.0\",\n" +
                "              \"title\": \"A tin coffee decanter\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 160000,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"e7eed88e-f6e0-11e3-87f6-005056a7235c\",\n" +
                "              \"locator\": \"http://dbpedia.org/resource/Test_cricket\",\n" +
                "              \"duration\": \"5000.0\",\n" +
                "              \"title\": \"Test cricket\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 185000,\n" +
                "              \"enrichments\": []\n" +
                "            }\n" +
                "          ]\n" +
                "        },\n" +
                "        {\n" +
                "          \"id\": \"3\",\n" +
                "          \"duration\": \"180000.0\",\n" +
                "          \"title\": \"Horse painting\",\n" +
                "          \"startTime\": 284000,\n" +
                "          \"fragments\": [\n" +
                "            {\n" +
                "              \"id\": \"cdba0bb8-e00c-11e3-95a7-005056a7235c\",\n" +
                "              \"locator\": \"http://dbpedia.org/resource/Jan_Altink\",\n" +
                "              \"duration\": \"180000.0\",\n" +
                "              \"title\": \"Jan Altink\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 285000,\n" +
                "              \"enrichments\": [\"https://www.youtube.com/watch?v=7cFmprcLzVo\", \"https://www.flickr.com/search?sort=relevance&text=jan%20altink\", \"http://www.europeana.eu/portal/record/2021623/index_php_a_1_id_24_s_1_rg_1_rg_id_480_rg_b_1.html\"]\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"c1dc27ba-1359-11e4-a082-005056a7235c\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"4000.0\",\n" +
                "              \"title\": \"Groninger Ploeg\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 327640,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"44268d96-1350-11e4-8d2b-005056a7235c\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"4598.999\",\n" +
                "              \"title\": \"Jan Altink\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 400839,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"c4a971c8-1359-11e4-b4fc-005056a7235c\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"3638.977\",\n" +
                "              \"title\": \"Friesland\",\n" +
                "              \"type\": \"Location\",\n" +
                "              \"startTime\": 550280,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"f2cfc0c8-c63a-11e3-a7cd-005056a7235c\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"4558.96\",\n" +
                "              \"title\": \"schuif\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 1804280,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"edeef272-c63a-11e3-95ec-005056a7235c\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"3041.0156\",\n" +
                "              \"title\": \"zon\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 1844119,\n" +
                "              \"enrichments\": []\n" +
                "            }\n" +
                "          ]\n" +
                "        },\n" +
                "        {\n" +
                "          \"id\": \"1\",\n" +
                "          \"duration\": \"237000.0\",\n" +
                "          \"title\": \"Silver tea jar\",\n" +
                "          \"startTime\": 2157000,\n" +
                "          \"fragments\": [\n" +
                "            {\n" +
                "              \"id\": \"589390e2-f79b-11e3-87f6-005056a7235c\",\n" +
                "              \"locator\": \"http://dbpedia.org/resource/Silver\",\n" +
                "              \"duration\": \"144000.0\",\n" +
                "              \"title\": \"Zilveren theebus\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 2165000,\n" +
                "              \"enrichments\": [\"http://europeana.eu/portal/search.html?query=zilver+theebus&rows=24\"]\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"2e6b620e-f79b-11e3-a224-005056a7235c\",\n" +
                "              \"locator\": \"http://dbpedia.org/resource/Tea\",\n" +
                "              \"duration\": \"110000.0\",\n" +
                "              \"title\": \"Friese theebus\",\n" +
                "              \"type\": \"Food\",\n" +
                "              \"startTime\": 2199000,\n" +
                "              \"enrichments\": [\"http://europeana.eu/portal/search.html?query=friesland+theebus&rows=24\"]\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"20efcf98-f791-11e3-9020-005056a7235c\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"6641.1133\",\n" +
                "              \"title\": \"Friesland\",\n" +
                "              \"type\": \"Location\",\n" +
                "              \"startTime\": 2234159,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"10f3d3a0-f791-11e3-99a9-005056a7235c\",\n" +
                "              \"locator\": \"http://nl.wikipedia.org/wiki/Meesterteken\",\n" +
                "              \"duration\": \"4358.8867\",\n" +
                "              \"title\": \"Meesterteken\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 2285280,\n" +
                "              \"enrichments\": [\"http://www.925-1000.com/Fnetherlands_Date_Code.html\"]\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"89666b4a-f79b-11e3-a577-005056a7235c\",\n" +
                "              \"locator\": \"http://dbpedia.org/resource/Friesland\",\n" +
                "              \"duration\": \"15000.0\",\n" +
                "              \"title\": \"Friese zilversmeden\",\n" +
                "              \"type\": \"Place\",\n" +
                "              \"startTime\": 2294000,\n" +
                "              \"enrichments\": [\"http://europeana.eu/portal/search.html?query=zilversmid+friesland&rows=24\", \"http://www.friesmuseum.nl/het-museum/collectie/iconen/popta-zilver\"]\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"0b8759c8-f791-11e3-8ec5-005056a7235c\",\n" +
                "              \"locator\": \"http://nl.wikipedia.org/wiki/Zilver\",\n" +
                "              \"duration\": \"4439.9414\",\n" +
                "              \"title\": \"zilver\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 2302239,\n" +
                "              \"enrichments\": [\"http://nl.wikipedia.org/wiki/Zilver\"]\n" +
                "            }\n" +
                "          ]\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"id\": \"8a8187f2-3fc8-cb54-0140-7dd099380002\",\n" +
                "      \"title\": \"Tussen Kunst - 200\",\n" +
                "      \"shots\": \"http://tkk.dev/video/shots/1\",\n" +
                "      \"poster\": \"http://tkk.dev/video/shots/1/h/0/m/0/sec10.jpg\",\n" +
                "      \"src\": \"http://tkk.dev/video/raw.mp4\",\n" +
                "      \"duration\": 2733550,\n" +
                "      \"chapters\": [\n" +
                "        {\n" +
                "          \"id\": \"6\",\n" +
                "          \"duration\": \"101000.0\",\n" +
                "          \"title\": \"Jo Koster schilderij\",\n" +
                "          \"startTime\": 264000,\n" +
                "          \"fragments\": [\n" +
                "            {\n" +
                "              \"id\": \"ee10d366-60cc-11e3-8505-00264a16bc9a\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"3880.005\",\n" +
                "              \"title\": \"Amsterdam\",\n" +
                "              \"type\": \"Location\",\n" +
                "              \"startTime\": 294440,\n" +
                "              \"enrichments\": []\n" +
                "            }\n" +
                "          ]\n" +
                "        },\n" +
                "        {\n" +
                "          \"id\": \"1\",\n" +
                "          \"duration\": \"268000.0\",\n" +
                "          \"title\": \"Ring\",\n" +
                "          \"startTime\": 749000,\n" +
                "          \"fragments\": [\n" +
                "            {\n" +
                "              \"id\": \"6509c222-575c-11e3-ae14-00163ebdcad9\",\n" +
                "              \"locator\": \"http://dbpedia.org/resource/MOTI\",\n" +
                "              \"duration\": \"290000.0\",\n" +
                "              \"title\": \"Graphic Design Museum\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 1266000,\n" +
                "              \"enrichments\": [\"http://www.motimuseum.nl\", \"http://nl.wikipedia.org/wiki/Museum_of_the_Image\"]\n" +
                "            }\n" +
                "          ]\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"id\": \"8a8187f2-3fc8-cb54-0140-7dd151100003\",\n" +
                "      \"title\": \"Tussen Kunst - 600\",\n" +
                "      \"shots\": \"http://tkk.dev/video/shots/1\",\n" +
                "      \"poster\": \"http://tkk.dev/video/shots/1/h/0/m/0/sec10.jpg\",\n" +
                "      \"src\": \"http://tkk.dev/video/raw.mp4\",\n" +
                "      \"duration\": 2735740,\n" +
                "      \"chapters\": [\n" +
                "        {\n" +
                "          \"id\": \"4\",\n" +
                "          \"duration\": \"70000.0\",\n" +
                "          \"title\": \"Introduction\",\n" +
                "          \"startTime\": 10000,\n" +
                "          \"fragments\": [\n" +
                "            {\n" +
                "              \"id\": \"3c5142a0-5816-11e3-8732-00163ebdcad9\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"2120.0027\",\n" +
                "              \"title\": \"Amsterdam\",\n" +
                "              \"type\": \"Location\",\n" +
                "              \"startTime\": 40599,\n" +
                "              \"enrichments\": [\"http://euscreen.openimages.eu/images/655713/Nieuwe_ladderwagens_voor_de_Amsterdamse_brandweer_%280_33%29.png\"]\n" +
                "            }\n" +
                "          ]\n" +
                "        },\n" +
                "        {\n" +
                "          \"id\": \"1\",\n" +
                "          \"duration\": \"151000.0\",\n" +
                "          \"title\": \"Alexander\",\n" +
                "          \"startTime\": 90000,\n" +
                "          \"fragments\": [\n" +
                "            {\n" +
                "              \"id\": \"17999afc-5816-11e3-807f-00163ebdcad9\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"3881.0044\",\n" +
                "              \"title\": \"toegepaste kunst\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 114919,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"0d15650c-5816-11e3-807f-00163ebdcad9\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"4400.0015\",\n" +
                "              \"title\": \"Alexander de Grote\",\n" +
                "              \"type\": \"Person\",\n" +
                "              \"startTime\": 118999,\n" +
                "              \"enrichments\": []\n" +
                "            }\n" +
                "          ]\n" +
                "        },\n" +
                "        {\n" +
                "          \"id\": \"5\",\n" +
                "          \"duration\": \"138000.0\",\n" +
                "          \"title\": \"Bell\",\n" +
                "          \"startTime\": 382000,\n" +
                "          \"fragments\": [\n" +
                "            {\n" +
                "              \"id\": \"126b98a2-7867-11e3-a5c2-00264a16bc9a\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"4681.0\",\n" +
                "              \"title\": \"tin\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 448519,\n" +
                "              \"enrichments\": []\n" +
                "            }\n" +
                "          ]\n" +
                "        },\n" +
                "        {\n" +
                "          \"id\": \"2\",\n" +
                "          \"duration\": \"260000.0\",\n" +
                "          \"title\": \"Jan Toorop\",\n" +
                "          \"startTime\": 760000,\n" +
                "          \"fragments\": [\n" +
                "            {\n" +
                "              \"id\": \"17977066-e573-11e3-9f03-005056a7235c\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"4239.99\",\n" +
                "              \"title\": \"Jan Toorop\",\n" +
                "              \"type\": \"Person\",\n" +
                "              \"startTime\": 787520,\n" +
                "              \"enrichments\": []\n" +
                "            }\n" +
                "          ]\n" +
                "        }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"id\": \"8a8187f2-3fc8-cb54-0140-7dd247360004\",\n" +
                "      \"title\": \"Tussen Kunst - 960\",\n" +
                "      \"shots\": \"http://tkk.dev/video/1\",\n" +
                "      \"poster\": \"http://tkk.dev/video/shots/1/h/0/m/0/sec10.jpg\",\n" +
                "      \"src\": \"http://tkk.dev/video/raw.mp4\",\n" +
                "      \"duration\": 2694100,\n" +
                "      \"chapters\": [\n" +
                "        {\n" +
                "          \"id\": \"6\",\n" +
                "          \"duration\": \"70000.0\",\n" +
                "          \"title\": \"Kameel\",\n" +
                "          \"startTime\": 143000,\n" +
                "          \"fragments\": [\n" +
                "            {\n" +
                "              \"id\": \"aa418d84-7476-11e3-a29a-00163ebdcad9\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"3919.998\",\n" +
                "              \"title\": \"Kamelen\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 187279,\n" +
                "              \"enrichments\": []\n" +
                "            }\n" +
                "          ]\n" +
                "        },\n" +
                "        {\n" +
                "          \"id\": \"4\",\n" +
                "          \"duration\": \"244000.0\",\n" +
                "          \"title\": \"Egypte\",\n" +
                "          \"startTime\": 319000,\n" +
                "          \"fragments\": [\n" +
                "            {\n" +
                "              \"id\": \"a05cd020-6987-11e3-a0b9-00163ebdcad9\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"4198.9746\",\n" +
                "              \"title\": \"Egypte\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 360519,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"6bd49ba8-6987-11e3-86ad-00163ebdcad9\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"3279.9988\",\n" +
                "              \"title\": \"Gizeh\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 376559,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"f929ba4c-6987-11e3-a0b9-00163ebdcad9\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"3119.0186\",\n" +
                "              \"title\": \"Zeus\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 466400,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"edf18498-6987-11e3-9c9e-00163ebdcad9\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"4079.9866\",\n" +
                "              \"title\": \"Zeuskop\",\n" +
                "              \"type\": \"Thing\",\n" +
                "              \"startTime\": 486320,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"92cb4d9c-6987-11e3-8ddb-00163ebdcad9\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"3158.9966\",\n" +
                "              \"title\": \"Egyptische\",\n" +
                "              \"type\": \"Organization\",\n" +
                "              \"startTime\": 496400,\n" +
                "              \"enrichments\": []\n" +
                "            },\n" +
                "            {\n" +
                "              \"id\": \"4c338bca-67e2-11e3-995b-00163ebdcad9\",\n" +
                "              \"locator\": \"\",\n" +
                "              \"duration\": \"3440.979\",\n" +
                "              \"title\": \"Piet Ouborg\",\n" +
                "              \"type\": \"Person\",\n" +
                "              \"startTime\": 643359,\n" +
                "              \"enrichments\": []\n" +
                "            }\n" +
                "          ]\n" +
                "        }\n" +
                "      ]\n" +
                "    }\n" +
                "  ]\n" +
                "}";
    }
}
