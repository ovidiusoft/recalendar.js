import { Page, View, StyleSheet } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import Itinerary from '~/pdf/components/itinerary';
import PdfConfig from '~/pdf/config';
import { pageStyle } from '~/pdf/styles';
import { splitItemsByPages } from '~/pdf/utils';

class CustomPage extends React.Component {
	styles = StyleSheet.create({
		page: pageStyle( this.props.config ),
		content: {
			flex: 1,
		},
	});

	render() {
		const { config } = this.props;
		const { dpi, pageSize } = config;
		const itemsByPage = splitItemsByPages( config.customPagesItinerary );

		return (
			<>
				{itemsByPage.map( ( items, index ) => (
					<Page key={ index } size={ pageSize } dpi={ dpi }>
						<View style={ this.styles.page }>
							<View style={ this.styles.content }>
								<Itinerary items={ items } config={ config } />
							</View>
						</View>
					</Page>
				) )}
			</>
		);
	}
}

CustomPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
};

export default CustomPage;
