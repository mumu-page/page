import * as React from "react";
import Moveable from "react-moveable";
import "./test.css";

export default function Container() {
  const [target, setTarget] = React.useState();
  const [elementGuidelines, setElementGuidelines] = React.useState([]);
  const [frame, setFrame] = React.useState({
    translate: [0, 0],
  });
  React.useEffect(() => {
    setTarget(document.querySelector(".target")! as any);
    setElementGuidelines([
      document.querySelector(".nested.rotate"),
      document.querySelector(".nested.scale"),
      document.querySelector(".nested.first"),
      document.querySelector(".target"),
    ] as any);
  }, []);
  return (
    <div className="container">
      <div className="nested first">No Transform</div>
      <div className="nested scale">scale(1.2, 1.2)</div>
      <div className="nested rotate">rotate(30deg)</div>
      <div className="target">Target</div>
      <div
        className="nested rotate333"
        onClick={() => {
          setTarget(document.querySelector(".rotate333")! as any);
          setFrame({
            translate: [0, 0],
          });
        }}
      >
        rotate333
      </div>
      <Moveable
        target={target}
        elementGuidelines={elementGuidelines}
        snappable={true}
        bounds={{ left: 40, top: 40, right: 600, bottom: 430 }}
        verticalGuidelines={[0, 200, 400]}
        horizontalGuidelines={[0, 200, 400]}
        snapThreshold={5}
        isDisplaySnapDigit={true}
        snapGap={true}
        snapElement={true}
        snapVertical={true}
        snapHorizontal={true}
        snapCenter={false}
        snapDigit={0}
        draggable={true}
        throttleDrag={0}
        startDragRotate={0}
        throttleDragRotate={0}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        onDragStart={(e) => {
          e.set(frame.translate);
        }}
        onDrag={(e) => {
          frame.translate = e.beforeTranslate;
          e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`;
        }}
        onDragEnd={({ target, isDrag, clientX, clientY }) => {
          console.log("onDragEnd", target, isDrag);
        }}
      />
    </div>
  );
}
