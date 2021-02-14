import { createContext } from "react";
export const ClientContext = createContext();

const withClientContext = (WrappedComponent) => {
    class HOC extends React.Component {
        render() {
            return (
                <ClientContext.Consumer>
                    {context =>
                        <WrappedComponent clientContext={context} {...this.props} />
                    }
                </ClientContext.Consumer>
            );
        }
    }
    return HOC;
};

export default withClientContext;
