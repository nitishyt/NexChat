import React from 'react'

function TestDaisyUI() {
  return (
    <div className="p-10">
      <button className="btn btn-primary">Primary Button</button>
      <button className="btn btn-secondary ml-4">Secondary Button</button>
      <div className="card w-96 bg-base-100 shadow-xl mt-4">
        <div className="card-body">
          <h2 className="card-title">Card Title</h2>
          <p>If this card has styles, daisyUI is working!</p>
        </div>
      </div>
    </div>
  )
}

export default TestDaisyUI