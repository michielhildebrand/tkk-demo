'use strict';

angular.module('Config', []).constant('Config', {
  ENTITY_PROXY: 'http://linkedtv.project.cwi.nl/explore/entity_proxy',
  EUROPEANA_API: 'http://europeana.eu/api/v2',
  IR_API: 'http://{{app_address}}/ir',
  CONTENT_FILTERING_API: 'http://160.40.50.224/api/content_filtering',

  app_title_prefix: 'LinkedTV News',
  users: [
    {
      name: 'Ralph',
      avatar: 'img/anonym.jpg',
      id: 'ralph'
    },
    {
      name: 'Peter',
      avatar: 'img/anonym.jpg',
      id: 'peter'
    },
    {
      name: 'Nina',
      avatar: 'img/anonym.jpg',
      id: 'nina'
    }
  ],

  video_ids: [
    'adb65e0a-642b-432f-aa86-c296dab0375a'
  ],

  load_curated_videos: false,

  dimensions: [
    {
      id: 'other-media',
      title: 'In other media'
    },
    {
      id: 'background',
      title: 'Background'
    },
    {
      id: 'history',
      title: 'History'
    }
  ],

  tracking_enabled_default: true,

  springfield_ip: window.location.hostname,
  springfield_port: window.location.port,
  springfield_app: 'news',
  springfield_fullapp: '/domain/linkedtv/user/{}/html5application/news'
});
