// YouTubePlayer.js
// Исправленный модуль трейлеров для Lampa

var YouTubePlayer = {
  init: function(videoId, containerId) {
    this.videoId = videoId;
    this.containerId = containerId;
    this.player = null;
    this.firstPlay = false;
    this.autoStopTimeout = null;
    this.isVideoPlaying = false;
    this.isVideoPause = false;
    this.hideTime = 120000; // 2 min
    this.hideBodyTime = 10000; // 10 sec
    this.enabled = null;
    this.videoData = [];
    this.bindEvents();
  },

  bindEvents: function() {
    var _this = this;
    Lampa.Listener.follow('full', function(e) {
      if (e.type === 'complite') _this.addVideo(e.data.videos);
    });
    Lampa.Listener.follow('activity', function(e) {
      var enabled = Lampa.Controller.enabled();
      if (e.type == 'start') _this.enabled = enabled;
    });
    Navigator.follow('focus', function(event) {
      _this.enabled = Lampa.Controller.enabled();
      var el = event.elem.classList.contains('full-start__button');
      if (_this.firstPlay && _this.enabled.name !== 'full_start') {
        _this.firstPlay = false;
        _this.removePlayer('not in focus');
      }
      if (el) {
        setTimeout(function() {
          if (_this.isVideoPause && _this.player && _this.enabled.name === 'full_start') {
            _this.player.playVideo();
            _this.isVideoPause = false;
          }
          if (!_this.isVideoPlaying && _this.videoId && !Lampa.Player.opened() && !_this.firstPlay && Lampa.Activity.active().activity.render().find('.' + _this.containerId).length === 0 && _this.enabled && _this.enabled.name === 'full_start') {
            _this.removePlayer('new card');
            _this.startPlayer();
          }
        }, 500);
      } else {
        if (["console-tabs", "console-body", "menu", "head", "full_reviews", "full_episodes"].indexOf(_this.enabled.name) === -1) _this.removePlayer('enabled controller - ' + _this.enabled.name);
      }
    });
  },

  addVideo: function(videoData) {
    if (videoData && videoData.results && videoData.results[0]) {
      var index = videoData.results.findIndex(function(video) {
        return ((video.official === false || video.official) && video.iso_639_1 === 'ru') ||
          (video.name.toLowerCase().indexOf('официальный трейлер') !== -1 && video.official === true) ||
          (video.name.toLowerCase().indexOf('трейлер') !== -1) ||
          (video.official || !video.official);
      });
      if (index !== -1) {
        this.videoId = videoData.results[index].key;
      } else this.videoId = null;
      if (videoData.results.length > 1) this.videoData = videoData.results;
    }
  },

  tryPlayNextVideo: function() {
    var officialTrailerIndex = this.videoData.findIndex(function(video) {
      return video.name.toLowerCase().indexOf('официальный') !== -1;
    });
    if (officialTrailerIndex !== -1) {
      this.videoId = this.videoData[officialTrailerIndex].key;
      this.startPlayer();
    } else if (this.videoData.length >= 1) {
      this.videoId = this.videoData[1].key;
      this.startPlayer();
    } else {
      this.removePlayer('video not found');
    }
  },

  startPlayer: function() {
    var self = this;
    var loadYouTubePlayer = function() {
      if (typeof YT === 'undefined' || !YT.Player) {
        setTimeout(loadYouTubePlayer, 100);
        return;
      }
      self.player = new YT.Player(self.containerId, {
        height: (window.innerHeight + 600) * 2,
        width: window.innerWidth * 2,
        playerVars: {
          'controls': 0,
          'showinfo': 0,
          'autohide': 1,
          'modestbranding': 1,
          'autoplay': 1,
          'disablekb': 1,
          'fs': 0,
          'enablejsapi': 1,
          'playsinline': 1,
          'mute': 1,
          'rel': 0,
          'loop': 0,
          'suggestedQuality': 'hd1080',
          'setPlaybackQuality': 'hd1080'
        },
        videoId: self.videoId,
        events: {
          'onReady': function(event) { self.onPlayerReady(event); },
          'onStateChange': function(event) { self.onPlayerStateChange(event); },
          'onPlaybackQualityChange': function(event) { self.onPlaybackQualityChange(event); },
          'onError': function(event) { self.onPlayerError(event); }
        }
      });
      self.startAutoStopTimer();
    };
    var html = $('<div class="' + this.containerId + '"><div class="player-video__youtube-player" id="' + this.containerId + '"></div></div>');
    if (Lampa.Platform.tv() || Lampa.Platform.get() == 'android' || Lampa.Platform.get() == 'noname') {
      $('body').append(html[0]);
    } else {
      Lampa.Activity.active().activity.render().find('.full-start-new').prepend(html);
    }
    if (window.YT) loadYouTubePlayer(); else {
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.onload = loadYouTubePlayer;
      document.body.appendChild(tag);
    }
  },

  onPlayerReady: function(event) {
    var cont = Lampa.Activity.active().activity.render().find('.' + this.containerId).length && Lampa.Activity.active().activity.render().find('.' + this.containerId) || $('body').find('.' + this.containerId);
    $(cont).css({opacity: 1, transition: 'opacity 2s ease-in-out'});
    try {
      this.player.playVideo();
      if (!Lampa.Platform.is('apple')) event.target.unMute();
      this.isVideoPlaying = true;
      this.hidePoster();
    } catch (error) {
      console.log('YouTubePlayer error:', error);
    }
  },

  onPlayerStateChange: function(event) {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        this.fullScreen();
        break;
      case YT.PlayerState.ENDED:
        this.removePlayer();
        break;
      case YT.PlayerState.BUFFERING:
        event.target.setPlaybackQuality('hd1080');
        break;
      case -1:
        break;
      default:
        break;
    }
  },

  onPlaybackQualityChange: function(event) {
    // Optionally handle quality change
  },

  onPlayerError: function(event) {
    switch (event.data) {
      case 2:
        this.removePlayer(event.data);
        break;
      case 100:
        this.removePlayer(event.data);
        this.tryPlayNextVideo();
        break;
      case 101:
      case 150:
        this.removePlayer(event.data);
        this.tryPlayNextVideo();
        break;
      default:
        this.removePlayer(event.data);
    }
  },

  removePlayer: function(hide) {
    try {
      if (this.player) {
        if (typeof hide == 'string' && hide.indexOf('full_descr') >= 0) {
          this.isVideoPause = true;
          if (typeof this.player.pauseVideo === 'function') this.player.pauseVideo();
        } else {
          try {
            if (typeof this.player.destroy === 'function') {
              this.player.destroy();
            }
          } catch (error) {
            console.error('YouTubePlayer destroy error:', error);
          }
          $('.' + this.containerId).remove();
          this.fadeOut(false, false, true);
          this.isVideoPlaying = false;
          this.isVideoPause = false;
        }
        this.player = null;
        this.clearAutoStopTimer();
        if (hide !== 'new card') this.hidePoster();
      } else {
        // Если плеер уже уничтожен, просто убираем контейнер
        $('.' + this.containerId).remove();
        this.isVideoPlaying = false;
        this.isVideoPause = false;
        this.player = null;
        this.clearAutoStopTimer();
      }
    } catch (e) {
      console.error('YouTubePlayer removePlayer error:', e);
    }
  },

  startAutoStopTimer: function() {
    var self = this;
    this.autoStopTimeout = setTimeout(function() {
      self.removePlayer();
    }, self.hideTime);
  },

  clearAutoStopTimer: function() {
    if (this.autoStopTimeout) {
      clearTimeout(this.autoStopTimeout);
      this.autoStopTimeout = null;
    }
  },

  fullScreen: function() {
    var _self = this;
    if (window.innerWidth >= 768 && this.isVideoPlaying) {
      setTimeout(function() {
        if (!_self.isVideoPause) _self.fadeOut(true);
      }, _self.hideBodyTime);
    }
  },

  fadeOut: function(fid, key, rem) {
    try {
      var _this = this;
      var element;
      try {
        element = Lampa.Activity.active().activity.render().find('.full-start-new__body');
      } catch (e) {
        element = null;
      }
      if (!!rem) {
        $('body').toggleClass('card--no-cover', false);
        if (element) $(element).css({opacity: 1, transition: 'opacity 1s ease'});
      } else {
        if (element) {
          $(element).css({opacity: fid ? 0 : 1, transition: 'opacity 2s ease'});
          if (this.enabled && this.enabled.name == 'full_start') setTimeout(function() {
            $('body').toggleClass('card--no-cover', true);
            $(element).css({opacity: 0, transition: 'opacity 2s ease'});
          }, !_this.isVideoPause ? _this.hideBodyTime : 3000);
          else $('body').toggleClass('card--no-cover', fid);
          try {
            if ($('body').find('.youtube-trailers').length)
              $('body').find('.youtube-trailers').css({
                'z-index': (this.enabled && this.enabled.name !== 'full_start') ? -1 : !_this.isVideoPause && fid && !key ? 99 : 9
              });
          } catch (e) {}
        }
      }
    } catch (e) {
      console.error('YouTubePlayer fadeOut error:', e);
    }
  },

  hidePoster: function() {
    try {
      var _self = this;
      var fullStartNew;
      try {
        fullStartNew = Lampa.Activity.active().activity.render().find('.full-start-new');
      } catch (e) {
        fullStartNew = null;
      }
      if (fullStartNew && fullStartNew.length) {
        var fullPoster = fullStartNew.find('.full-start-new__img.full--poster');
        var hasTrailersPlayer = !!fullStartNew.find('.' + this.containerId).length;
        var updateFullPosterVisibility = function() {
          if (window.innerWidth >= 340 && window.innerWidth <= 480 && window.innerHeight > 480) {
            _self.fullScreen();
            $(fullPoster).css({opacity: hasTrailersPlayer ? '0' : '1', transition: hasTrailersPlayer ? 'opacity 1s ease-in-out' : 'none'});
          } else $(fullPoster).css({opacity:1, transition: 'none'});
        };
        Lampa.Keypad.listener.follow('keydown', function(e) {
          setTimeout(function() {
            _self.fadeOut(false, true);
          }, 100);
        });
        window.addEventListener('touchstart', function(e) {
          if (_self.isVideoPlaying && _self.player && typeof _self.player.isMuted === 'function') {
            if (_self.player.isMuted()) _self.player.unMute();
            _self.fadeOut(false, false, true);
            if (_self.isVideoPlaying) $(fullPoster).css({opacity:0, transition: 'none'});
          }
        });
        updateFullPosterVisibility();
        window.addEventListener('resize', updateFullPosterVisibility);
      }
    } catch (e) {
      console.error('YouTubePlayer hidePoster error:', e);
    }
  }
};

function addYouTubePlayer() {
  YouTubePlayer.init('VIDEO_ID', Lampa.Platform.tv() || Lampa.Platform.get() == 'noname' || Lampa.Platform.get() == 'android' ? 'youtube-trailers' : 'trailers-player');
  Lampa.Template.add('modss_style', `<style>
    .youtube-trailers {
      position: fixed;
      z-index: 9;
      left: 0em;
      right: 0;
      top: 0em;
      width: -webkit-calc(100%);
      width: calc(100%);
      height: 66%;
    }
    .youtube-trailers iframe {
      pointer-events: none;
      position: fixed;
      left: 0px;
      right: 0;
      top: -300px;
      border: 0;
      -webkit-transform-origin: left top;
      -moz-transform-origin: left top;
      -ms-transform-origin: left top;
      -o-transform-origin: left top;
      transform-origin: left top;
      -webkit-transform: scale(0.5);
      -moz-transform: scale(0.5);
      -ms-transform: scale(0.5);
      -o-transform: scale(0.5);
      transform: scale(0.5);
      -o-object-fit: cover;
      object-fit: cover;
      aspect-ratio: 10/9;
    }
    .trailers-player {
      position: fixed;
      left: 0em;
      right: 0;
      top: -5em;
      width: -webkit-calc(100%);
      width: calc(100%);
      height: 66%;
      z-index: -1;
      opacity: 0;
      -webkit-transition: opacity 0.5s ease-in-out;
      -o-transition: opacity 0.5s ease-in-out;
      transition: opacity 0.5s ease-in-out;
      overflow: hidden;
      pointer-events: none;
      -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAjCAYAAAA5dzKxAAAD+UlEQVRYhcWZ61IaQRCFz7KAgBgvyfu/XSqVquSXGrlKfjDH/Wh7FowYp6prVthl+5u+TE/b7HY7nWE07/y8Sa53Pc/7vh1leETJtygyKNcDXFPiPf68Te7N4AigMm+LbCSt+2CyVWkwU5lW0lDSqMyUAe5pw/1+xn+3AZjv8rAltpJWRZ4k3ddgaivEVbcyF5LGZZ5AxkVGgBwHuSjie1rMmbUM8qy9NZYF5EnSzwyGKxLdgStupaeSZpLmki7L9ax8Z2Wp/ATfTcs1gWkh6uLxXMSWWRT5HmEy3yaElZsA4ErSlzJfFSBDEYhCMFrQbkmhhzheItBG0m1mGVpigFXzSl4GiJsiBJoDhm41SpT33OrQIoRg4GdQjaQtYTIf9cvGALmSdC3ptshdALK7TYPSYyhNd4pBT4C4yBGMbjjvczO6mF3CMDcF4qukbwXKMAaxO9F1mN36UngcNTBaqx3iS4tfwDQ6Vhfsc3XudQeo6wI6U5ehsnQbE0vfFnBsHGTbWszQMnYzxwxh6GbX6qzi9Eqlszj4V4h09MUMYZwAZupc7UsQBz1dK1P87BCEiS8iTM06huLewoDnHpGNsygfR4wZXxOEpQo3vSmEwd6q35U+bBwrNOPGaZeLe4djhGXIfx81V8iyW7QWhWn200aEeUtK7CvTP2VEmOykxgMQa6It/n7W4TnjU0bNzaLyLrk3ktZFfJZYl88N6Gfjb304JBMAVzZawRAr7c8QC+3PEC6/J+rSfG1nj8Xi2d3RMD5v74J4tQ1iiMciD+rOIwP8Fnd/gmTl/NmghgHEL6F70a0M8iDpXl2J75RsSxouljRxPyPkWWA4ai5mq/xRZw0Xk2151uArHRaa8bCVVcseZ6vNTnGxsfYWoaIEWWpf3hiW55ZagyOz2LthIpAzWFtghtpbhhulQWi5ubqzPSuE2iHt2AnTevWNRuibxQTwchTVfsVZATCwDeys9qjX538XqKNw7VqPTRJaK2tmZMMJZ5PVZhmQ44YrFTskTzqsoGvNDAPacuze0GpZRvTMfcu6rGLMNPjSD24rwLaKYR7VHQ9i78xCwKkO+2zs1mRNjgzGC7qT9DuLmbj6NRC74FpdvFghWoBVNq1AkClmPkv3i3uUF9M6vOqbUWEFmCxtO4NFV7EibCcxGRCMCxDdk41Bbsp8/6Lo8KMWM9xEXUTGTOcfG5Yfi31jukmtH51ZjgtTg4n730LSr6bnXxpxM4vNiTbMgyN/sxfHA59BY1MwdncyGHvGUtJ9H0wGFEuRmKqznT37LD4bU3/ce+J2QCDL8hhMDa5vjgXlKeVKtlBZPZdV9i9x/NZ/NkXyU1cigzilaq59l+rxF+5FNzBsTB9XAAAAAElFTkSuQmCC);
      mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAjCAYAAAA5dzKxAAAD+UlEQVRYhcWZ61IaQRCFz7KAgBgvyfu/XSqVquSXGrlKfjDH/Wh7FowYp6prVthl+5u+TE/b7HY7nWE07/y8Sa53Pc/7vh1leETJtygyKNcDXFPiPf68Te7N4AigMm+LbCSt+2CyVWkwU5lW0lDSqMyUAe5pw/1+xn+3AZjv8rAltpJWRZ4k3ddgaivEVbcyF5LGZZ5AxkVGgBwHuSjie1rMmbUM8qy9NZYF5EnSzwyGKxLdgStupaeSZpLmki7L9ax8Z2Wp/ATfTcs1gWkh6uLxXMSWWRT5HmEy3yaElZsA4ErSlzJfFSBDEYhCMFrQbkmhhzheItBG0m1mGVpigFXzSl4GiJsiBJoDhm41SpT33OrQIoRg4GdQjaQtYTIf9cvGALmSdC3ptshdALK7TYPSYyhNd4pBT4C4yBGMbjjvczO6mF3CMDcF4qukbwXKMAaxO9F1mN36UngcNTBaqx3iS4tfwDQ6Vhfsc3XudQeo6wI6U5ehsnQbE0vfFnBsHGTbWszQMnYzxwxh6GbX6qzi9Eqlszj4V4h09MUMYZwAZupc7UsQBz1dK1P87BCEiS8iTM06huLewoDnHpGNsygfR4wZXxOEpQo3vSmEwd6q35U+bBwrNOPGaZeLe4djhGXIfx81V8iyW7QWhWn200aEeUtK7CvTP2VEmOykxgMQa6It/n7W4TnjU0bNzaLyLrk3ktZFfJZYl88N6Gfjb304JBMAVzZawRAr7c8QC+3PEC6/J+rSfG1nj8Xi2d3RMD5v74J4tQ1iiMciD+rOIwP8Fnd/gmTl/NmghgHEL6F70a0M8iDpXl2J75RsSxouljRxPyPkWWA4ai5mq/xRZw0Xk2151uArHRaa8bCVVcseZ6vNTnGxsfYWoaIEWWpf3hiW55ZagyOz2LthIpAzWFtghtpbhhulQWi5ubqzPSuE2iHt2AnTevWNRuibxQTwchTVfsVZATCwDeys9qjX538XqKNw7VqPTRJaK2tmZMMJZ5PVZhmQ44YrFTskTzqsoGvNDAPacuze0GpZRvTMfcu6rGLMNPjSD24rwLaKYR7VHQ9i78xCwKkO+2zs1mRNjgzGC7qT9DuLmbj6NRC74FpdvFghWoBVNq1AkClmPkv3i3uUF9M6vOqbUWEFmCxtO4NFV7EibCcxGRCMCxDdk41Bbsp8/6Lo8KMWM9xEXUTGTOcfG5Yfi31jukmtH51ZjgtTg4n730LSr6bnXxpxM4vNiTbMgyN/sxfHA59BY1MwdncyGHvGUtJ9H0wGFEuRmKqznT37LD4bU3/ce+J2QCDL8hhMDa5vjgXlKeVKtlBZPZdV9i9x/NZ/NkXyU1cigzilaq59l+rxF+5FNzBsTB9XAAAAAElFTkSuQmCC);
      -webkit-mask-size: 300% 130%;
      mask-size: 300% 80%;
      -webkit-mask-position: 70% 10%;
      mask-position: 70% 0%;
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
    }
    .trailers-player iframe, .trailers-player video {
      position: absolute;
      top: 40%;
      left: 0;
      width: 100%;
      height: auto;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      transform: translateY(-50%);
      -o-object-fit: cover;
      object-fit: cover;
      aspect-ratio: 10/9;
      pointer-events: none;
    }
    /* ...остальные стили и медиа-запросы... */
  </style>`);
  $('body').append(Lampa.Template.get('modss_style', {}, true));
}

if (window.appready) addYouTubePlayer(); else {
  Lampa.Listener.follow('app', function(e) {
    if (e.type == 'ready') addYouTubePlayer();
  });
}
