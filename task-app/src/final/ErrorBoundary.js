import React, { Component } from 'react';
import SimpleErrorMessage from '../final/SimpleErrorMessage';

export const withErrorBoundary = (WrappedComponent, FallbackComponent = SimpleErrorMessage) => {
  return class ErrorBoundary extends Component {
    state = {
      errorThrown: false
    }

    componentDidCatch(error, errorInfo) {
      this.setState({
        errorThrown: true,
        error: error,
        errorInfo: errorInfo
      });
    }

    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return {
        errorThrown: true,
        error: error
      };
    }

    render() {
      if (this.state.errorThrown) {
        return <FallbackComponent {...this.props} error={this.state.error} errorInfo={this.state.errorInfo}>{this.props.errorInfo}</FallbackComponent>
      }
      return <WrappedComponent {...this.props} />;
    }
  }
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error: error
    };
  }

  componentDidCatch(error, info) {
    this.setState({
      errorInfo: info
    });
  }

  render() {
    if (this.state.hasError) {
      return <SimpleErrorMessage {...this.props} error={this.state.error} errorInfo={this.state.errorInfo}>{this.props.errorInfo}</SimpleErrorMessage>
    }
    return this.props.children;
  }
}
