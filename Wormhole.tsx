import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { WormholeCacheData, WormholeOptions, WormholeSource } from './wormhole.types';
import useForceUpdate from './hooks/useForceUpdate';

export type WormholeProps = {
  readonly source: WormholeSource;
  readonly renderLoading?: () => JSX.Element;
  readonly renderError?: (props: { readonly error: Error }) => JSX.Element;
  readonly dangerouslySetInnerJSX?: boolean;
  readonly onError?: (error: Error) => void;
  readonly shouldOpenWormhole?: (
    source: WormholeSource,
    options: WormholeOptions
  ) => Promise<WormholeCacheData>;
  [key: string]: any;
};

export default function Wormhole({
  source,
  renderLoading = () => <React.Fragment />,
  renderError = () => <React.Fragment />,
  dangerouslySetInnerJSX = false,
  onError = console.error,
  shouldOpenWormhole,
  ...extras
}: WormholeProps): JSX.Element {

  const { forceUpdate } = useForceUpdate();

  const [Component, setComponent] = React.useState<React.Component | null>(null);
  const [compStyles, setCompStyles] = React.useState<Record<string, string | number> | null>(null);

  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        if (typeof shouldOpenWormhole === 'function') {
          const compData = await shouldOpenWormhole(source, { dangerouslySetInnerJSX });

          setCompStyles(compData.styles);

          return setComponent(() => compData.component);
        }

        throw new Error(
          `[Wormhole]: Expected function shouldOpenWormhole, encountered ${
            typeof shouldOpenWormhole
          }.`
        );
      } catch (e) {
        setComponent(() => null);

        setError(e);
        onError(e);

        return forceUpdate();
      }
    })();

  }, [
    shouldOpenWormhole,
    source,
    setComponent,
    forceUpdate,
    setError,
    dangerouslySetInnerJSX,
    onError,
  ]);

  const FallbackComponent = React.useCallback((): JSX.Element => {
    return renderError({ error: new Error('[Wormhole]: Failed to render.') });
  }, [renderError]);

  if (typeof Component === 'function') {
    return (
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        {/* @ts-ignore */}
        <Component styles2={compStyles} {...extras} />
      </ErrorBoundary>
    );
  } else if (error) {
    return renderError({ error });
  }

  return renderLoading();
}
