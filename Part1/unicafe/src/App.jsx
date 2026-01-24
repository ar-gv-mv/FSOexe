import { useState } from 'react'

const StatisticLine = ({text, value}) => {
  if (text==="positive"){
    return (
      <tbody>
        <tr>
          <td>{text}</td>
          <td>{value} %</td>
        </tr>
      </tbody>
      )
  }

  return (
  <tbody>
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  </tbody>
  )
}

const Statistics = ({good, neutral, bad, total}) => {
  let average = (good*1+neutral*0+bad*-1)/total
  let positive = (good/total)*100
  if (total===0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
  <table>
    <StatisticLine text="good" value ={good} />
    <StatisticLine text="neutral" value ={neutral} />
    <StatisticLine text="bad" value ={bad} />
    <StatisticLine text="all" value ={total} />
    <StatisticLine text="average" value ={average} />
    <StatisticLine text="positive" value ={positive} />
  </table>
  )
}

const Button = ({onClick, teksti}) => (
  <button onClick={onClick}>{teksti}</button>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const reGood = () => {
    const updGood=good+1
    setGood(updGood)
    setTotal(updGood+neutral+bad)
  }

  const reNeutral = () => {
    const updNeutral=neutral+1
    setNeutral(updNeutral)
    setTotal(updNeutral+good+bad)
  }

  const reBad = () => {
    const updBad=bad+1
    setBad(updBad)
    setTotal(updBad+neutral+good)
  }

  return (
    <div>
      <h1>
        give feedback
      </h1>
      <Button onClick={reGood} teksti="good"/>
      <Button onClick={reNeutral} teksti="neutral"/>
      <Button onClick={reBad} teksti="bad"/>
      <h1>
      statistics
      </h1>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </div>
  )
}

export default App
