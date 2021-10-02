import React, { useRef } from 'react';
import { ScrollView as RNScrollView } from 'react-native';

const ScrollView = ({ children, ref, ...props }) => {
	const scrollRef = useRef(ref);

	const childrenWithProps = React.Children.map(children, (child) => {
		if (React.isValidElement(child)) {
			return React.cloneElement(child, {
				scrollView: scrollRef?.current,
			});
		}
		return child;
	});

	return (
		<RNScrollView {...props} ref={scrollRef}>
			{childrenWithProps}
		</RNScrollView>
	);
};

export { ScrollView };
