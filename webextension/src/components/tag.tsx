import React from 'react';
import styled, { css } from 'Styles';

const TagItem = styled.li<{ removable: boolean }>`
	display: inline-block;
	margin: 0;
	font-size: 1.3rem;
	font-weight: normal;
	color: ${props => props.theme.textColorOffset};

	${props => props.removable && css`
		cursor: pointer;

		&:hover {
			text-decoration: line-through;
		}
	`}

	&:not(:last-child) {
		margin-right: .5rem;
	}
`;

interface Props {
	id: string;
	label: string | (() => React.ReactNode);
	onRemove?(tag: string): void;
}

const Tag: Comp<Props> = (props) => {
	const handleRemove = () => {
		if (props.onRemove) props.onRemove(props.id);
	};

	return (
		<TagItem
			onClick={handleRemove}
			removable={!!props.onRemove}
		>
			#{typeof props.label === 'string' ? props.label : props.label()}
		</TagItem>
	);
};

export default Tag;
