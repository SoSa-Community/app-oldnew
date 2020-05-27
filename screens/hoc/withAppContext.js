import React from 'react';
import { AppContext } from '../context/AppContext'

const withAppContext = (WrappedComponent) => {
    class HOC extends React.Component {

        render() {
            return (
                <AppContext.Consumer>
                    {context =>
                        <WrappedComponent appContext={context} {...this.props} />
                    }
                </AppContext.Consumer>
            );
        }
    }
    return HOC;
};

export default withAppContext;
