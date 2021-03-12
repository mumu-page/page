import React from "react";

export default (props: any) => {
  const { onClick = () => {}, options = [] } = props;

  return (
    <div className="menu-container">
      {options.map((item: any, index: number) => {
        const { icon, key, label, type, className } = item;

        return (
          <>
            <div className="menu-item">
              <a
                onClick={() => {
                  onClick(key, label);
                }}
                className={type === "del" ? `${className} del` : className}
              >
                {React.cloneElement(icon, {
                  className: "menu-item-icon",
                })}
                {label}
              </a>
            </div>
            {index !== options.length - 1 && <hr></hr>}
          </>
        );
      })}
    </div>
  );
};
