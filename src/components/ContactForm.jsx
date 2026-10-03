import { useEffect, useRef, useState } from 'react'
import { getSupabase } from '../lib/supabase'

const emptyNote = { name: '', email: '', subject: '', message: '' }

export default function ContactForm() {
  const [note, setNote] = useState(emptyNote)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [attempted, setAttempted] = useState(false)
  const heading = useRef(null)
  const firstField = useRef(null)
  const previousSent = useRef(false)
  const requestInProgress = useRef(false)

  useEffect(() => {
    if (sent === previousSent.current) return
    if (sent) heading.current?.focus()
    else firstField.current?.focus()
    previousSent.current = sent
  }, [sent])

  const update = event => setNote({ ...note, [event.target.name]: event.target.value })

  const submit = async event => {
    event.preventDefault()
    // The ref blocks repeat events immediately, before React rerenders the button.
    if (requestInProgress.current) return
    if (!event.currentTarget.reportValidity()) {
      setAttempted(true)
      return
    }

    requestInProgress.current = true
    setSubmitting(true)
    setErrorMessage('')

    try {
      const { error } = await getSupabase()
        .schema('public')
        .from('contact_messages')
        .insert({
          name: note.name.trim(),
          email: note.email.trim(),
          subject: note.subject,
          message: note.message.trim(),
        })

      // No .select(): visitors have INSERT-only access to this table.
      if (error) throw error

      setNote(emptyNote)
      setAttempted(false)
      setSent(true)
    } catch {
      setErrorMessage('We couldn’t send your message. Please try again in a moment. Your note is still here.')
    } finally {
      requestInProgress.current = false
      setSubmitting(false)
    }
  }

  return (
    <div className="contact-form">
      <h2 ref={heading} tabIndex={-1}>{sent ? 'Thank you for your note.' : 'A note to SOWON.'}</h2>
      {sent ? (
        <div className="success">
          <p className="preview-notice" role="status">Your message has been sent. We’ll get back to you soon.</p>
          <div className="form-actions">
            <button className="button" onClick={() => setSent(false)}>Write another note</button>
          </div>
        </div>
      ) : (
        <>
          <p className="form-note">All fields are required. Send us your note and we’ll get back to you.</p>
          <form className={attempted ? 'validation-attempted' : ''} aria-busy={submitting} onInvalid={() => setAttempted(true)} onSubmit={submit}>
            <div className="form-grid">
              <label>Name<input ref={firstField} value={note.name} onChange={update} disabled={submitting} required name="name" autoComplete="name" maxLength={80} pattern=".*\S.*" title="Please enter your name." /></label>
              <label>Email<input value={note.email} onChange={update} disabled={submitting} required name="email" type="email" autoComplete="email" /></label>
            </div>
            <label>Subject<select value={note.subject} onChange={update} disabled={submitting} name="subject" required><option value="" disabled>What’s on your mind?</option><option>Visiting the café</option><option>Creative workshops</option><option>Personalized gifts</option><option>Something else</option></select></label>
            <label>Message<textarea value={note.message} onChange={update} disabled={submitting} name="message" required rows={5} maxLength={2000} placeholder="Tell us a little more…" /></label>
            {attempted && <p className="validation-hint">Please complete every field and use a valid email address.</p>}
            {errorMessage && <p className="validation-hint" role="alert">{errorMessage}</p>}
            <button className="button" type="submit" disabled={submitting} aria-live="polite">{submitting ? 'Sending…' : 'Send Message'} <span aria-hidden="true">→</span></button>
          </form>
        </>
      )}
    </div>
  )
}
