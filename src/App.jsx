import { useState } from 'react'
import './App.css'

function createQuestion() {
  const coefficient = Math.floor(Math.random() * 5) + 1
  const solution = Math.floor(Math.random() * 19) - 6
  const constant = Math.floor(Math.random() * 21) - 10
  const result = coefficient * solution + constant
  const signedConstant = constant < 0 ? `− ${Math.abs(constant)}` : `+ ${constant}`

  return {
    equation: `${coefficient}x ${signedConstant} = ${result}`,
    solution,
  }
}

function App() {
  const [question, setQuestion] = useState(createQuestion)
  const [answer, setAnswer] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState('')
  const isFinished = feedback === 'correct' || feedback === 'revealed'

  function checkAnswer(event) {
    event.preventDefault()
    if (isFinished) return

    const submittedAnswer = answer.trim()
    if (!submittedAnswer || !Number.isFinite(Number(submittedAnswer))) {
      setFeedback('invalid')
      return
    }

    if (Number(submittedAnswer) === question.solution) {
      setFeedback('correct')
      return
    }

    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    setFeedback(nextAttempts >= 3 ? 'revealed' : 'incorrect')
  }

  function getNextQuestion() {
    setQuestion(createQuestion())
    setAnswer('')
    setAttempts(0)
    setFeedback('')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Solve home">
          <span className="brand-mark" aria-hidden="true">x</span>
          <span>solve</span>
        </a>
        <span className="topbar-label">ALGEBRA PRACTICE</span>
      </header>

      <section className="solver" aria-labelledby="page-title">
        <p className="eyebrow">A LITTLE PRACTICE GOES A LONG WAY</p>
        <h1 id="page-title">Find the value of <span>x</span></h1>
        <p className="intro">Solve the equation below. You’ve got this.</p>

        <div className="equation-card" aria-live="polite">
          <span className="equation-label">YOUR EQUATION</span>
          <p className="equation">{question.equation}</p>
          <div className="attempts" aria-label={`${attempts} of 3 attempts used`}>
            {[0, 1, 2].map((attempt) => (
              <span
                className={`attempt-dot${attempt < attempts ? ' used' : ''}`}
                key={attempt}
              />
            ))}
            <span className="attempt-copy">{3 - attempts} tries left</span>
          </div>
        </div>

        <form className="answer-form" onSubmit={checkAnswer}>
          <label htmlFor="answer">Your answer <span>(x = ?)</span></label>
          <div className="answer-controls">
            <span className="input-prefix" aria-hidden="true">x =</span>
            <input
              id="answer"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="Type your answer"
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value)
                if (feedback === 'invalid' || feedback === 'incorrect') setFeedback('')
              }}
              disabled={isFinished}
              aria-describedby="feedback"
            />
            <button type="submit" disabled={isFinished}>Check answer</button>
          </div>
        </form>

        <div
          id="feedback"
          className={`feedback${feedback ? ` ${feedback}` : ''}`}
          role="status"
          aria-live="polite"
        >
          {feedback === 'invalid' && 'Enter a number to check your answer.'}
          {feedback === 'incorrect' && 'Not quite — give it another try.'}
          {feedback === 'correct' && 'That’s right! Great work.'}
          {feedback === 'revealed' && <>The answer is <strong>x = {question.solution}</strong>. Give the next one a try!</>}
        </div>

        {(feedback === 'correct' || feedback === 'revealed') && (
          <button className="next-button" type="button" onClick={getNextQuestion}>
            Try another equation <span aria-hidden="true">→</span>
          </button>
        )}
      </section>

      <footer className="page-footer">One step at a time. One equation at a time.</footer>
    </main>
  )
}

export default App
