'use strict';

angular.module('Config', []).constant('Config', {
  ENTITY_PROXY: 'http://linkedtv.project.cwi.nl/explore/entity_proxy',
  EUROPEANA_API: 'http://europeana.eu/api/v2',
  IR_API: 'http://{{app_address}}/ir',
  //CONTENT_FILTERING_API: 'http://160.40.50.224/api/content_filtering',
  //CONTENT_FILTERING_API: 'http://160.40.50.224:8087/RestReasoner/adhoc_content_filtering',
  CONTENT_FILTERING_API: 'http://{{app_address}}/filtering',
  DOCUMENT_PROXY: 'http://{{app_address}}/doc',

  app_title_prefix: 'LinkedTV Culture',
  users: [
    {
      name: 'Rita',
      avatar: 'img/Rita.png',
      id: 'rita'
    },
    {
      name: 'Bert & Anne',
      avatar: 'img/Bert.png',
      id: 'bertanne'
    },
    {
      name: 'Michael',
      avatar: 'img/Michael.jpg',
      id: 'michael'
    }
  ],

  video_ids: [
    '8a8187f2-3fc8-cb54-0140-7dccd76f0001',
    '8a8187f2-3fc8-cb54-0140-7dd151100003',
    '8a8187f2-3fc8-cb54-0140-7dd247360004',
    '8a8187f2-3fc8-cb54-0140-7dd099380002',
    '953b4d09-e828-4623-b9ff-be3072411a98',
    '8a8187f2-3fc8-cb54-0140-7dd2d0650005',
    'c44643ee-823e-476c-a099-bd28bcf1e56a'
  ],

  load_curated_videos: true,

  dimensions: [
    {
      id: 'about',
      title: 'About'
    },
    {
      id: 'background',
      title: 'Background'
    },
    {
      id: 'artworks',
      title: 'Related works'
    },
    {
      id: 'related',
      title: 'Related chapters'
    }
  ],

  tracking_enabled_default: true,

  synchronize_model: false,

  springfield_ip: window.location.hostname,
  springfield_port: window.location.port,
  springfield_app: 'news',
  springfield_fullapp: '/domain/linkedtv/user/{}/html5application/news',

  debug_enabled: false
});
