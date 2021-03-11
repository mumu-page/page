import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useContext,
} from "react";
import Guides from "@scena/react-guides";
import { Context } from "../../stores/context";
import { SET_MOVEABLE_OPTIONS } from "../../stores/action-type";

export default forwardRef((props: GuidesOptions, ref) => {
  const { type } = props;
  const guides: any = React.useRef();
  const { commonDispatch } = useContext(Context);

  useImperativeHandle(
    ref,
    () => ({
      guides,
    }),
    []
  );

  const onResize = useCallback(() => {
    guides.current?.resize?.();
  }, []);

  const onWheel = useCallback((e) => {
    let scrollX = 0;
    let scrollY = 0;
    scrollX += e.deltaX;
    scrollY += e.deltaY;
    guides?.scrollGuides?.(scrollY);
    guides?.scroll?.(scrollX);
  }, []);

  useEffect(() => {
    guides.current?.resize?.();
    window.addEventListener("wheel", onWheel);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <Guides
      {...props}
      ref={guides}
      onChangeGuides={({ guides }) => {
        if (type === "horizontal") {
          commonDispatch({
            type: SET_MOVEABLE_OPTIONS,
            payload: {
              horizontalGuidelines: guides,
            },
          });
        }
        if (type === "vertical") {
          commonDispatch({
            type: SET_MOVEABLE_OPTIONS,
            payload: {
              verticalGuidelines: guides,
            },
          });
        }
      }}
    />
  );
});

export interface RulerProps {
  type?: "horizontal" | "vertical";
  width?: number;
  height?: number;
  unit?: number;
  zoom?: number;
  direction?: "start" | "end";
  style?: any;
  backgroundColor?: string;
  lineColor?: string;
  textColor?: string;
}

export interface GuidesOptions extends RulerProps {
  className?: string;
  setGuides?: (guides: number[]) => any;
  rulerStyle?: any;
  snapThreshold?: number;
  snaps?: number[];
  displayDragPos?: boolean;
  dragPosFormat?: (value: number) => string | number;
}

export interface GuidesInterface {
  getGuides(): number[];
  scroll(pos: number): void;
  scrollGuides(pos: number): void;
  loadGuides(guides: number[]): void;
  resize(): void;
}
