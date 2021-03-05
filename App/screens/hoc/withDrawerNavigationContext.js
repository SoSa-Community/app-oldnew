import React from 'react';
import { DrawerNavigationContext } from '../../context/DrawerNavigationContext'

const withDrawerNavigationContext = (WrappedComponent) => {
    class HOC extends React.Component {

        render() {
            return (
                <DrawerNavigationContext.Consumer>
                    {context =>
                        <WrappedComponent navigationContext={context} {...this.props} />
                    }
                </DrawerNavigationContext.Consumer>
            );
        }
    }
    return HOC;
};
export default withDrawerNavigationContext;
