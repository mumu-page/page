import React from "react";
import { ReactSortable } from "react-sortablejs";
import { v4 } from "uuid";

interface HasNotFormItemSortableItemProps {
  components?: React.ReactElement[];
}
export default (props: HasNotFormItemSortableItemProps) => {
  const { components } = props;

  return (
    <ReactSortable
      sort
      className="sortable-list"
      group={{
        name: "editor-area",
        put: true,
      }}
      list={[]}
      ghostClass="sortable-ghost"
      chosenClass="sortable-chosen"
      animation={200}
      fallbackTolerance={5}
      delayOnTouchOnly
      setList={(newState) => {}}
    >
      <div key={v4()} /* key={item} */>30303</div>
    </ReactSortable>
  );
};
