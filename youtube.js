(function () {
	'use strict';

	const SEARCH_SERVER = 'https://domain:port/search'; //ip адрес сервера где работает p&p.py
	const PROXY_SERVER = 'https://domain:port'; //ip адрес сервера где работает p&p.py
	const STORAGE_KEY = 'yt_trailer_use_proxy';

	function cleanText(text) {
		return (text || '').toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, '').trim();
	}

	function matchScore(title, nameVariants) {
		const cleanTitle = cleanText(title);
		let maxRatio = 0;
		for (const name of nameVariants) {
			const cleanName = cleanText(name);
			if (!cleanName) continue;
			const titleWords = cleanTitle.split(' ');
			const nameWords = cleanName.split(' ');
			const intersection = titleWords.filter(w => nameWords.includes(w)).length;
			const ratio = intersection / nameWords.length;
			if (ratio > maxRatio) maxRatio = ratio;
		}
		return maxRatio;
	}

	function searchTrailer(query, useProxy, success, fail) {
		fetch(`${SEARCH_SERVER}?q=${encodeURIComponent(query)}`)
			.then(res => res.json())
			.then(data => {
				if (data.videos && data.videos.length > 0) {
					const trailers = data.videos.map(video => {
						const videoIdMatch = video.url.match(/[?&]v=([^&]+)/);
						const videoId = videoIdMatch ? videoIdMatch[1] : null;
						const thumb = video.thumbnail ? (useProxy ? `${PROXY_SERVER}/ytthumb?url=${encodeURIComponent(video.thumbnail)}` : video.thumbnail) : '';
						return {
							title: video.title,
							subtitle: video.channel,
							url: useProxy && videoId ? `${PROXY_SERVER}/ytproxy?id=${videoId}` : video.url,
							icon: `<img class="size-youtube" src="${thumb}">`,
							template: 'selectbox_icon'
						};
					});
					success(trailers);
				} else fail([]);
			})
			.catch(e => {
				console.warn('YT search failed:', e);
				fail(e);
			});
	}

	function loadYoutubeTrailer(event, useProxy, success) {
		if (!event.object || !event.data || !event.data.movie) return;
		const movie = event.data.movie;
		const year = (movie.release_date || movie.first_air_date || '').substring(0, 4) || '';
		const queries = [movie.title, movie.name, movie.original_title, movie.original_name].filter(Boolean);
		const nameVariants = queries.map(q => cleanText(q));

		function tryNextQuery(index) {
			if (index >= queries.length) return success([]);
			const query = `${queries[index]} ${year} трейлер`;
			searchTrailer(query, useProxy, videos => {
				if (!videos || videos.length === 0) return tryNextQuery(index + 1);
				const filtered = [], fallback = [];
				videos.forEach(video => {
					const title = cleanText(video.title);
					const score = matchScore(title, nameVariants);
					const hasTrailerKeyword = title.includes('трейлер') || title.includes('тизер');
					const hasYear = year && title.includes(year);
					if (score > 0.5 && (hasTrailerKeyword || hasYear)) filtered.push(video);
					else if (score > 0.3) fallback.push(video);
				});
				let result = filtered;
				if (result.length < 5 && fallback.length > 0) result = result.concat(fallback.slice(0, 15 - result.length));
				success(result.slice(0, 7));
			}, () => tryNextQuery(index + 1));
		}

		tryNextQuery(0);
	}

	function startPlugin() {
		if (window.youtube_trailer_plugin_combined) return;
		window.youtube_trailer_plugin_combined = true;
		if (localStorage.getItem(STORAGE_KEY) === null) localStorage.setItem(STORAGE_KEY, 'true');

		const btnClass = 'button--yt_trailer';
		const buttonHtml = `
			<div class="full-start__button selector ${btnClass}" data-subtitle="YouTube трейлеры">
				<svg style="color: white; transform: scale(1.2); transform-origin: center;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="24" height="24">
					<path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" fill="white"></path>
				</svg><span>YouTube</span>
			</div>`;

		Lampa.Listener.follow('full', event => {
			if (event.type === 'complite' || event.type === 'active') {
				const render = event.object.activity.render();
				if (!render) return;
				const trailerBtn = render.find('.view--torrent');
				if (trailerBtn.length) {
					$('.' + btnClass).remove();
					trailerBtn.after($(buttonHtml));
					const btn = $('.' + btnClass);
					btn.removeClass('hide');
					let foundVideos = [];

					btn.off('hover:enter').on('hover:enter', () => {
						if (foundVideos.length === 0) {
							Lampa.Noty.show('Идёт поиск трейлера');
						} else {
							Lampa.Select.show({
								title: 'YouTube трейлеры',
								items: foundVideos,
								onSelect: video => Lampa.Player.play(video),
								onBack: () => Lampa.Controller.toggle('full_start')
							});
						}
					});

					const useProxy = localStorage.getItem(STORAGE_KEY) === 'true';
					loadYoutubeTrailer(event, useProxy, videos => { foundVideos = videos || []; });
				}
			}
		});

		Lampa.SettingsApi.addComponent({
			component: 'yt_trailer_settings',
			name: 'YouTube трейлеры',
			icon: `
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="transform: scale(1.2); transform-origin: center;">
					<path fill="white" d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6C14.9 167 14.9 256.3 14.9 256.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zM232.2 337.6V174.4L374.9 256 232.2 337.6z"/>
				</svg>`
		});

		Lampa.SettingsApi.addParam({
			component: 'yt_trailer_settings',
			param: { name: STORAGE_KEY, type: 'trigger', default: false },
			field: { name: 'Проксирование', description: 'Включите, чтобы использовать ваш прокси-сервер' },
			onChange: val => {
				localStorage.setItem(STORAGE_KEY, val.toString());
				Lampa.Settings.update();
			}
		});
	}

	if (window.appready) startPlugin();
	else Lampa.Listener.follow('app', e => { if (e.type === 'ready') startPlugin(); });
})();
