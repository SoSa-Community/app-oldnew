import React from 'react';
import { NavigationContext } from '../context/NavigationContext'

const withNavigationContext = (WrappedComponent) => {
    class HOC extends React.Component {

        render() {
            return (
                <NavigationContext.Consumer>
                    {context =>
                        <WrappedComponent navigationContext={context} {...this.props} />
                    }
                </NavigationContext.Consumer>
            );
        }
    }
    return HOC;
};

export default withNavigationContext;
