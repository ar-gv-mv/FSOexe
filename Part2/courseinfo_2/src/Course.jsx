const Header = ({cName}) => {
    return (
      <div>
        <h1>
          {cName}
        </h1>
      </div>
    )
  }

  const Part = ({part}) => {
    return (
      <div>
        <p>
          {part.name} {part.exercises}
        </p>
      </div>
    )
  }

  const Content = ({parts}) => {
    return (
      <div>
          {parts.map(part => (<Part key={part.id} part={part}/>))}
      </div>
    )
  }

  const Total = ({parts}) => {
    const totalAmount = parts.reduce((sum, parti) => sum + parti.exercises, 0)
    return (
      <div>
        <strong>total of {totalAmount} exercises</strong>
      </div>
    )
  }

  const Course = ({course}) => {
    return (
        <div>
            <Header cName={course.name}/>
            <Content parts={course.parts}/>
            <Total parts={course.parts}/>
        </div>
    )
  }

export default Course