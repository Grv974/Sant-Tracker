import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Garde-fou global : aucune donnée de santé n'est loggée (§15.2) —
 * seul le message technique de l'erreur est envoyé en console.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Erreur de rendu', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Textes bilingues en dur : l'i18n peut être la cause du crash.
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg p-6 text-center text-ink">
          <h1 className="font-display text-xl font-bold">Quelque chose s’est mal passé / Something went wrong</h1>
          <p className="max-w-md text-sm text-muted">
            Vos données sont en sécurité dans votre navigateur. / Your data is safe in your browser.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-white"
          >
            Recharger / Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
