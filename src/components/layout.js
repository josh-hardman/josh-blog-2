import React from "react"
import { Link } from "gatsby"

import { rhythm, scale, colors } from "../utils/typography"
import "./layout.css"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  let header
  console.log(title)
  if (location.pathname === rootPath) {
    header = (
      <Link
        style={{
          boxShadow: `none`,
          color: `inherit`,
        }}
        to={`/`}
      >
        <h1
          style={{
            ...scale(1),
            marginBottom: 0,
            marginTop: 0,
          }}
        >
          {title[0]}
        </h1>
        {title[1] && (
          <h1
            style={{
              ...scale(1),
              color: colors.primary,
              marginTop: 0,
            }}
          >
            {title[1]}
          </h1>
        )}
      </Link>
    )
  } else {
    header = (
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {`${title[0]} ${title[1]}`}
        </Link>
      </h3>
    )
  }
  return (
    <>
      <div className="color-border" />
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(26),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <header>{header}</header>
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    </>
  )
}

export default Layout
