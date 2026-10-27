import { Component, type ReactNode } from 'react'

/** Swallows failures of optional enhancements (e.g. WebGL unavailable) and shows a fallback. */
export class ErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) console.warn('[enhancement disabled]', error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
