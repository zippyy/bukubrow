import styled from 'Styles';
import { URLMatch } from 'Modules/compare-urls';
import { colors } from 'Modules/badge';

export enum BadgeWeight {
	Primary,
	Secondary,
	None,
}

export const mapURLMatchToBadgeWeight = (urlMatch: URLMatch): BadgeWeight => {
	switch (urlMatch) {
		case URLMatch.Exact: return BadgeWeight.Primary;
		case URLMatch.Domain: return BadgeWeight.Secondary;
		default: return BadgeWeight.None;
	}
};

interface Props {
	weight: BadgeWeight;
}

const size = '8px';

const Badge = styled.span<Props>`
	width: ${size};
	height: ${size};
	display: inline-block;
	vertical-align: middle
	border-radius: 50%;
	background: ${(props) => {
		switch (props.weight) {
			case BadgeWeight.Primary: return colors[URLMatch.Exact];
			case BadgeWeight.Secondary: return colors[URLMatch.Domain];
			case BadgeWeight.None: return 'transparent';
		}
	}};
`;

export default Badge;
