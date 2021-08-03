import * as React from 'react'
import { Typography } from 'antd'
import { shortid } from '../../utils/utils'

export default (props: any) => {
  const { onClick = () => {}, options = [] } = props

  return (
    <div className="menu-container">
      {options.map((item: any, index: number) => {
        const { icon, key, label, type, className } = item

        return (
          <React.Fragment key={shortid()}>
            <div className="menu-item">
              <Typography.Link
                onClick={() => {
                  onClick(key, label)
                }}
                className={type === 'del' ? `${className} del` : className}
              >
                {React.cloneElement(icon, {
                  className: 'menu-item-icon',
                })}
                {label}
              </Typography.Link>
            </div>
            {index !== options.length - 1 && <hr></hr>}
          </React.Fragment>
        )
      })}
    </div>
  )
}
