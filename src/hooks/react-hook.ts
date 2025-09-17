import { useEffect, useRef } from "react";

export const useDidMount = (callback: () => void) => {
  useEffect(() => {
    if (typeof callback === "function") {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useEffectWithoutMounted = (cb: () => void, deps?: unknown[]) => {
  const firstRender = useRef<boolean>(true);

  useEffect(() => {
    if (firstRender.current) return;
    cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useDidMount(() => {
    firstRender.current = false;
  });
};

export const useDerivedStateFromProps = <P>(
  cb: (prevProps: P | null, nextProps: P | null) => void,
  props: P
) => {
  const prevRef = useRef<P | null>(null);
  const prevProps = prevRef.current;

  if (prevProps !== props) {
    cb(prevProps, props);
    prevRef.current = props;
  }
};

export const useSafeCallback = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return <P, A extends unknown[]>(callback: (...args: A) => P) =>
    (...args: A) => {
      if (!mountedRef.current) return null;

      return callback(...args);
    };
};
