import { Page, View, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import Header from '~/pdf/components/header';
import Itinerary from '~/pdf/components/itinerary';
import MiniCalendar, { HIGHLIGHT_NONE } from '~/pdf/components/mini-calendar';
import PdfConfig from '~/pdf/config';
import { yearRetrospectiveLink } from '~/pdf/lib/links';
import { content, pageStyle } from '~/pdf/styles';
import { splitItemsByPages } from '~/pdf/utils';

class YearRetrospectivePage extends React.Component {
	styles = StyleSheet.create(
		Object.assign( {}, { content, page: pageStyle( this.props.config ) } ),
	);

	getNameOfYear() {
		const { date } = this.props;
		return date.format( 'YYYY' );
	}

	render() {
		const { date, config } = this.props;
		const itemsByPage = splitItemsByPages( config.yearRetrospectiveItinerary );
		return (
			<>
				<Page id={ yearRetrospectiveLink( date ) } size={ config.pageSize } dpi={ config.dpi }>
					<View style={ this.styles.page }>
						<Header
							isLeftHanded={ config.isLeftHanded }
							title="Year Retrospective"
							titleSize={ 15 }
							subtitle={ this.getNameOfYear() }
							subtitleSize={ 18 }
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

YearRetrospectivePage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( YearRetrospectivePage );
