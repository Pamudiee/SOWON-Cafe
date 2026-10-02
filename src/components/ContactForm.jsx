import { useEffect, useRef, useState } from 'react'

const emptyNote = { name: '', email: '', subject: '', message: '' }

export default function ContactForm() {
  const [note, setNote] = useState(emptyNote)
  const [preview, setPreview] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const heading = useRef(null)
  const firstField = useRef(null)
  const previousPreview = useRef(false)

  useEffect(() => {
    if (preview === previousPreview.current) return
    if (preview) heading.current?.focus()
    else firstField.current?.focus()
    previousPreview.current = preview
  }, [preview])

  const update = event => setNote({ ...note, [event.target.name]: event.target.value })
  return (
    <div className="contact-form">
      <h2 ref={heading} tabIndex={-1}>{preview ? 'Your note, ready to review.' : 'A note to SOWON.'}</h2>
      {preview ? (
        <div className="success">
          <p className="preview-notice" role="status">Preview only. Your message has not been sent or stored.</p>
          <dl className="summary-details contact-summary">
            <div><dt>From</dt><dd>{note.name}</dd></div>
            <div><dt>Email</dt><dd>{note.email}</dd></div>
            <div><dt>Subject</dt><dd>{note.subject}</dd></div>
          </dl>
          <p className="message-preview">{note.message}</p>
          <div className="form-actions">
            <button className="button" onClick={() => setPreview(false)}>Edit my note</button>
            <button className="text-link" onClick={() => { setNote(emptyNote); setAttempted(false); setPreview(false) }}>Write another note</button>
          </div>
        </div>
      ) : (
        <>
          <p className="form-note">All fields are required. Preview your note before you finish. This portfolio form does not send or store messages.</p>
          <form className={attempted ? 'validation-attempted' : ''} onInvalid={() => setAttempted(true)} onSubmit={event => { event.preventDefault(); setPreview(true) }}>
            <div className="form-grid">
              <label>Name<input ref={firstField} value={note.name} onChange={update} required name="name" autoComplete="name" maxLength={80} pattern=".*\S.*" title="Please enter your name." /></label>
              <label>Email<input value={note.email} onChange={update} required name="email" type="email" autoComplete="email" /></label>
            </div>
            <label>Subject<select value={note.subject} onChange={update} name="subject" required><option value="" disabled>What’s on your mind?</option><option>Visiting the café</option><option>Creative workshops</option><option>Personalized gifts</option><option>Something else</option></select></label>
            <label>Message<textarea value={note.message} onChange={update} name="message" required rows={5} maxLength={2000} placeholder="Tell us a little more…" /></label>
            {attempted && <p className="validation-hint">Please complete every field and use a valid email address.</p>}
            <button className="button" type="submit">Preview Message <span aria-hidden="true">→</span></button>
          </form>
        </>
      )}
    </div>
  )
}
