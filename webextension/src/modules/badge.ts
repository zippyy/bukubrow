import { Maybe } from 'purify-ts/Maybe';
import { browser } from 'webextension-polyfill-ts';
import { URLMatch } from 'Modules/compare-urls';
import { getBookmarks } from 'Modules/cache';
import { getActiveTab, onTabActivity } from 'Comms/shared';

export const colors = {
	[URLMatch.Exact]: '#4286f4',
	[URLMatch.Domain]: '#a0c4ff',
};

let urlState: URL[] = [];

const hrefToUrlReducer = (acc: URL[], href: string): URL[] =>
	Maybe
		// This can throw if the href passed as an argument is invalid
		.encase(() => new URL(href))
		.caseOf({
			Just: (url) => [...acc, url],
			Nothing: () => acc,
		});

export const fetchBookmarksAndUpdateBadge = async () => {
	const fetchedBookmarks = await getBookmarks().run();

	fetchedBookmarks
		.map(bms => bms
			.map(bm => bm.url)
			.reduce(hrefToUrlReducer, []),
		)
		.ifJust((bookmarks) => {
			urlState = bookmarks;

			updateBadge();
		});
};

const checkUrl = (url: URL) => {
	let result = URLMatch.None;

	for (const bookmarkUrl of urlState) {
		if (bookmarkUrl.href === url.href) {
			result = URLMatch.Exact;
			break;
		}

		if (bookmarkUrl.hostname === url.hostname) {
			result = URLMatch.Domain;
		}
	}

	return result;
}

const updateBadge = async () => {
	const activeTab = await getActiveTab().run();

	activeTab
		.chain(tab => Maybe.fromNullable(tab.url))
		.map(href => new URL(href))
		.map(checkUrl)
		.ifJust((result) => {
			switch (result) {
				case URLMatch.Exact:
					browser.browserAction.setBadgeBackgroundColor({ color: colors[URLMatch.Exact] });
					browser.browserAction.setBadgeText({ text: ' ' });
					break;
				case URLMatch.Domain:
					browser.browserAction.setBadgeBackgroundColor({ color: colors[URLMatch.Domain] });
					browser.browserAction.setBadgeText({ text: ' ' });
					break;
				case URLMatch.None:
					// Empty string disables the badge
					browser.browserAction.setBadgeText({ text: '' });
					break;
			}
		});
};

export const initBadgeAndWatch = () => {
	fetchBookmarksAndUpdateBadge();

	onTabActivity(updateBadge);
};
