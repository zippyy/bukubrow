import React, { useRef } from 'react';
import { Maybe } from 'purify-ts/Maybe';
import { ParsedInputResult } from 'Modules/parse-search-input';
import { LocalBookmarkWeighted } from 'Modules/bookmarks';
import { Key } from 'ts-key-enum';
import { scrollToEl } from 'Modules/scroll-window';
import useListenToKeydown from 'Hooks/listen-to-keydown';
import styled from 'Styles';
import Bookmark from 'Components/bookmark';

const WrapperList = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
`;

type BookmarkId = LocalBookmark['id'];

interface Props {
	onOpenBookmark(id: BookmarkId): void;
	onEditBookmark(id: BookmarkId): void;
	onDeleteBookmark(id: BookmarkId): void;
	openFocusedBookmark(): void;
	attemptFocusedBookmarkIndexIncrement(): boolean;
	attemptFocusedBookmarkIndexDecrement(): boolean;
	bookmarks: LocalBookmarkWeighted[];
	parsedFilter: ParsedInputResult;
	focusedBookmarkId: Maybe<BookmarkId>;
}

const BookmarksList: Comp<Props> = (props) => {
	const activeBookmarkEl = useRef<HTMLElement>(null);

	const propsRef = useRef(props);
	propsRef.current = props;

	useListenToKeydown((evt) => {
		const liveProps = propsRef.current;

		if (evt.key === Key.Enter) liveProps.openFocusedBookmark();

		// preventDefault to prevent keyboard scrolling
		if (evt.key === Key.ArrowUp) {
			evt.preventDefault();
			liveProps.attemptFocusedBookmarkIndexDecrement();

			if (activeBookmarkEl && activeBookmarkEl.current) scrollToEl(activeBookmarkEl.current);
		}

		if (evt.key === Key.ArrowDown) {
			evt.preventDefault();
			liveProps.attemptFocusedBookmarkIndexIncrement();

			if (activeBookmarkEl && activeBookmarkEl.current) scrollToEl(activeBookmarkEl.current);
		}
	});

	return (
		<WrapperList>
			{props.bookmarks.map((bookmark) => {
				const isFocused = bookmark.id === props.focusedBookmarkId.extract();

				return (
					<Bookmark
						key={bookmark.id}
						id={bookmark.id}
						title={bookmark.title}
						url={bookmark.url}
						desc={bookmark.desc}
						tags={bookmark.tags}
						parsedFilter={props.parsedFilter}
						isFocused={isFocused}
						activeTabURLMatch={bookmark.weight}
						openBookmark={props.onOpenBookmark}
						onEdit={props.onEditBookmark}
						onDelete={props.onDeleteBookmark}
						ref={isFocused ? activeBookmarkEl : undefined}
					/>
				);
			})}
		</WrapperList>
	);
};

export default BookmarksList;
