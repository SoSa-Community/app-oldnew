import React from 'react';
import { MembersNavigationContext } from '../context/MembersNavigationContext'

const withMembersNavigationContext = (WrappedComponent) => {
    class HOC extends React.Component {

        render() {
            return (
                <MembersNavigationContext.Consumer>
                    {context =>
                        <WrappedComponent navigationContext={context} {...this.props} />
                    }
                </MembersNavigationContext.Consumer>
            );
        }
    }
    return HOC;
};
export default withMembersNavigationContext;
