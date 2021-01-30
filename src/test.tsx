import React, { useState } from "react";
import { Button } from "antd";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {v4} from "uuid";

import "./index.css";

export default function TodoList() {
  const [items, setItems] = useState([
    { id: v4(), text: "Buy eggs" },
    { id: v4(), text: "Pay bills" },
    { id: v4(), text: "Invite friends over" },
    { id: v4(), text: "Fix the TV" },
  ]);
  return (
    <div style={{ marginTop: "2rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <TransitionGroup className="todo-list">
          {items.map(({ id, text }) => (
            <CSSTransition key={id} timeout={500} classNames="alert">
              <li>
                <Button
                  className="remove-btn"
                  onClick={() =>
                    setItems((items) => items.filter((item) => item.id !== id))
                  }
                >
                  &times;
                </Button>
                {text}
              </li>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
      <Button
        onClick={() => {
          const text = prompt("Enter some text");
          if (text) {
            setItems((items) => [...items, { id: v4(), text }]);
          }
        }}
      >
        Add Item
      </Button>
    </div>
  );
}
