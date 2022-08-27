import React from 'react';
// import Dashheader from 'components/Headers/Dashheader';
import ErrorFallback from './ErrorFallback/ErrorFallback';
// import Container from 'reactstrap/lib/Container';
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.warn(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <>
                    {/* <Dashheader title={'Something went wrong.'} />
                    <Container> */}
                    <ErrorFallback />
                    {/* </Container> */}
                </>
            );
        }

        return this.props.children;
    }
}
export default ErrorBoundary;
