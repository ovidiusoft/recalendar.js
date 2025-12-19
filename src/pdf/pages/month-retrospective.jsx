import { Page, View, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import Header from '~/pdf/components/header';
import Itinerary from '~/pdf/components/itinerary';
import MiniCalendar, { HIGHLIGHT_NONE } from '~/pdf/components/mini-calendar';
import PdfConfig from '~/pdf/config';
import { monthRetrospectiveLink } from '~/pdf/lib/links';
import { content, pageStyle } from '~/pdf/styles';
import { splitItemsByPages } from '~/pdf/utils';

class MonthRetrospectivePage extends React.Component {
	styles = StyleSheet.create(
		Object.assign( {}, { content, page: pageStyle( this.props.config ) } ),
	);

	getNameOfMonth() {
		const { date } = this.props;
		return date.format( 'MMMM YYYY' );
	}

	render() {
		const { date, config } = this.props;
		const itemsByPage = splitItemsByPages( config.monthRetrospectiveItinerary );
		return (
			<>
				<Page id={ monthRetrospectiveLink( date ) } size={ config.pageSize } dpi={ config.dpi }>
					<View style={ this.styles.page }>
						<Header
							isLeftHanded={ config.isLeftHanded }
							title="Month retrospective"
							titleSize={ 15 }
							subtitle={ this.getNameOfMonth() }
							subtitleSize={ 18 }
							previousLink={
								'#' + monthRetrospectiveLink( date.subtract( 1, 'month' ) )
							}
							nextLink={ '#' + monthRetrospectiveLink( date.add( 1, 'month' ) ) }
							calendar={
								<MiniCalendar
									date={ date }
									highlightMode={ HIGHLIGHT_NONE }
									config={ config }
								/>
							}
						/>
						<View style={ this.styles.content }>
							<Itinerary items={ itemsByPage[ 0 ] } config={ config } />
						</View>
					</View>
				</Page>
				{itemsByPage.slice( 1 ).map(
					( items, index ) => (
						<Page key={ index } size={ config.pageSize } dpi={ config.dpi }>
							<View style={ this.styles.page }>
								<Itinerary items={ items } config={ config } />
							</View>
						</Page>
					),
				)}
			</>
		);
	}
}

MonthRetrospectivePage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( MonthRetrospectivePage );
