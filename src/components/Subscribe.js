import React, { useState } from "react"
import addToMailchimp from "gatsby-plugin-mailchimp"
import "./styles.css"

const Subscribe = () => {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [result, setResult] = useState()
  // 2. via `async/await`
  const handleSubmit = async (email, listFields) => {
    const result = await addToMailchimp(email, listFields)
    setResult(result.msg)
    // I recommend setting `result` to React state
    // but you can do whatever you want
  }

  return (
    <div className="sub-wrapper">
      <div className="sub-inner">
        <h2 className="sub-header">Stay in the loop</h2>
        <p className="sub-description">Get the latest by signing up...</p>
        <div className="sub-input-wrapper">
          <input
            className="sub-input"
            type="text"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="sub-input"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <button
            className="sub-button"
            onClick={() =>
              handleSubmit(email, {
                FNAME: firstName,
              })
            }
          >
            Subscribe
          </button>
        </div>
        {result && <div dangerouslySetInnerHTML={{ __html: result }} />}
      </div>
    </div>
  )
}

export default Subscribe
