const Header = (props) => {
  console.log(props)
  return (
    <div>
      <h1>
        {props.course}
      </h1>
    </div>
  )
}

const Part = (props) => {
  console.log(props)
  return (
    <div>
      <p>
        {props.parti} {props.exi}
      </p>
    </div>
  )
}

const Content = (props) => {
  console.log(props)
  return (
    <div>
        <Part parti={props.parts[0].name} exi={props.parts[0].exercises}/>
        <Part parti={props.parts[1].name} exi={props.parts[1].exercises}/>
        <Part parti={props.parts[2].name} exi={props.parts[2].exercises}/>
    </div>
  )
}
const Total = (props) => {
  console.log(props)
  let sum = 0
  props.parts.forEach(value => {
    sum+=value.exercises
  })
  
  return (
    <div>
      <p>
        Number of exercises {sum}
      </p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App
