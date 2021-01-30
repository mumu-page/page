import React, { Component } from "react";
import { ReactSortable } from "react-sortablejs";

interface BasicClassState {
  list: { id: string; name: string }[];
}

export class BasicClass extends Component<{}, BasicClassState> {
  state: BasicClassState = {
    list: [
      { id: "1", name: "shrek1" },
      { id: "2", name: "shrek2" },
      { id: "3", name: "shrek3" },
      { id: "4", name: "shrek4" },
      { id: "5", name: "shrek5" },
    ],
  };
  render() {
    return (
      <ReactSortable
        list={this.state.list}
        animation={200}
        delayOnTouchOnly
        setList={(newState) => this.setState({ list: newState })}
      >
        {this.state.list.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </ReactSortable>
    );
  }
}