import React, { useEffect, useRef } from "react";
import InfiniteViewer from "react-infinite-viewer";
import Ruler from "./Ruler";
import "./index.scss";

/**
 * 让他能够滚动
 */
export default (props: any) => {
  const horizontalGuides = useRef();
  const verticalGuides = useRef();
  const viewerRef = useRef(null);

  useEffect(() => {
    (viewerRef.current as any)?.scrollCenter();
  }, []);

  return (
    <div className="infinite-viewer-container">
      <div
        className="reset"
        onClick={() => {
          (viewerRef.current as any)?.scrollCenter();
        }}
      ></div>
      <Ruler
        className="guides horizontal"
        ref={horizontalGuides}
        type="horizontal"
        height={30}
      />
      <Ruler
        className="guides vertical"
        width={30}
        ref={verticalGuides}
        type="vertical"
      />
      <InfiniteViewer
        className="infinite-viewer"
        ref={viewerRef}
        useForceWheel
        onScroll={(e) => {
          // console.log("onScroll", horizontalGuides, verticalGuides);
          const _horizontalGuides = (horizontalGuides.current as any)?.guides
            ?.current;
          const _verticalGuides = (verticalGuides.current as any)?.guides
            ?.current;
          _horizontalGuides?.scroll?.(e.scrollLeft);
          _horizontalGuides?.scrollGuides?.(e.scrollTop);

          _verticalGuides?.scroll?.(e.scrollTop);
          _verticalGuides?.scrollGuides?.(e.scrollLeft);
        }}
        onPinch={(e) => {
          const zoom = Math.max(0.1, e.zoom);
          const _horizontalGuides = (horizontalGuides.current as any)?.guides
            ?.current;
          const _verticalGuides = (verticalGuides.current as any)?.guides
            ?.current;
          _horizontalGuides.zoom = zoom;
          _verticalGuides.zoom = zoom;
          (viewerRef.current as any).zoom = zoom;
        }}
      >
        <div className="viewport">{props.children}</div>
      </InfiniteViewer>
    </div>
  );
};
