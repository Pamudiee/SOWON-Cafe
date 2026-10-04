import { useRef, useState } from 'react'
import { getSupabase } from '../lib/supabase'
import { workshops, money } from '../data/catalog'
import { cafe } from '../data/cafe'
import { PageIntro, Image, Filters, Modal } from '../components/UI'

function ReservationSummary({ workshop, day, time, guests }) {
  return (
    <section className="order-summary reservation-summary" aria-label="Reservation summary">
      <p className="eyebrow">YOUR CREATIVE MOMENT</p>
      <h3>{workshop.name}</h3>
      <dl className="summary-details">
        <div><dt>Weekly session</dt><dd>{day} · {time}</dd></div>
        <div><dt>Location</dt><dd>{cafe.location}</dd></div><div><dt>Time zone</dt><dd>{cafe.timeZoneLabel}</dd></div><div><dt>Duration</dt><dd>{workshop.duration}</dd></div>
        <div><dt>Guests</dt><dd>{guests} × {money(workshop.price)}</dd></div>
        <div><dt>Included</dt><dd>Materials, guidance & a drink</dd></div>
      </dl>
      <div className="summary-total"><span>Total</span><strong>{money(workshop.price * guests)}</strong></div>
    </section>
  )
}

function ReservationForm({ workshop, day, time, onClose }) {
  const [step, setStep] = useState('details')
  const [guests, setGuests] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [emailNotice, setEmailNotice] = useState('')
  const [submittedGuests, setSubmittedGuests] = useState(1)
  const requestInProgress = useRef(false)
  const title = step === 'complete' ? 'Your request is received.' : step === 'reserve' ? 'Make room for a moment.' : workshop.name

  async function handleSubmit(event) {
    event.preventDefault()
    if (requestInProgress.current) return
    setAttempted(true)
    if (!event.currentTarget.reportValidity() || !name.trim()) return
    requestInProgress.current = true
    setSubmitting(true)
    setError('')
    setEmailNotice('')
    try {
      const { error: submissionError } = await getSupabase()
        .schema('public')
        .from('workshop_reservations')
        .insert({
          workshop_name: workshop.name,
          customer_name: name.trim(),
          email: email.trim(),
          guests,
          price_per_person: workshop.price,
          total_price: workshop.price * guests,
          day,
          time,
        })
      if (submissionError) throw submissionError
      // Email delivery is separate: its failure must never retry the saved reservation.
      try {
        const { data, error: emailError } = await getSupabase().functions.invoke(
          'send-workshop-confirmation',
          {
            body: {
              email: email.trim(),
              customer_name: name.trim(),
              workshop_name: workshop.name,
              guests,
              total_price: workshop.price * guests,
              day,
              time,
            },
          },
        )
        if (emailError || data?.error || data?.success === false) {
          throw new Error('Confirmation unavailable')
        }
      } catch {
        setEmailNotice('Your reservation request is saved, but we couldn’t confirm email delivery. Please contact the café if you need help. There is no need to submit again.')
      }
      setSubmittedGuests(guests)
      setName('')
      setEmail('')
      setGuests(1)
      setAttempted(false)
      setStep('complete')
    } catch {
      setError('We couldn’t send your reservation request. Please try again. Your details are still here.')
    } finally {
      requestInProgress.current = false
      setSubmitting(false)
    }
  }

  function handleClose(event) {
    if (requestInProgress.current) {
      event?.preventDefault()
      return
    }
    onClose()
  }
  return (
    <Modal title={title} onClose={handleClose}>
      {step === 'complete' ? (
        <div className="success" role="status">
          <span aria-hidden="true">✳</span>
          <p>Thank you! Your reservation request has been received. We’ll email you to confirm the session and availability.</p>
          <ReservationSummary workshop={workshop} day={day} time={time} guests={submittedGuests} />
          {emailNotice && <p className="form-note">{emailNotice}</p>}
          <div className="form-actions"><button className="button" onClick={onClose}>Keep exploring</button><button className="text-link" onClick={() => setStep('reserve')}>New reservation</button></div>
        </div>
      ) : step === 'reserve' ? (
        <form className={attempted ? 'validation-attempted' : ''} onInvalid={() => setAttempted(true)} onSubmit={handleSubmit} aria-busy={submitting}>
          <ReservationSummary workshop={workshop} day={day} time={time} guests={guests} />
          <p className="form-note">Send a reservation request. We’ll confirm the session and availability by email. No payment is taken.</p>
          <label>Your name<input required disabled={submitting} value={name} onChange={event => setName(event.target.value)} autoComplete="name" maxLength={80} pattern=".*\S.*" /></label>
          <label>Email address<input required disabled={submitting} value={email} onChange={event => setEmail(event.target.value)} type="email" autoComplete="email" /></label>
          <label>Guests
            <select disabled={submitting} value={guests} onChange={event => setGuests(Number(event.target.value))}>
              {Array.from({ length: workshop.spots }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
            </select>
          </label>
          {attempted && <p className="validation-hint">Please add your name and a valid email address.</p>}
          <p className="reservation-total" role="status">{money(workshop.price)} × {guests} {guests === 1 ? 'guest' : 'guests'} <strong>{money(workshop.price * guests)}</strong></p>
          {error && <p className="validation-hint" role="alert">{error}</p>}
          <button className="text-link back-link" type="button" disabled={submitting} onClick={() => setStep('details')}>← Workshop details</button>
          <button className="button" type="submit" disabled={submitting}>{submitting ? 'Sending request…' : 'Submit Reservation'} <span aria-hidden="true">→</span></button>
        </form>
      ) : (
        <>
          <Image className="detail-image" src={workshop.image} alt={workshop.type} />
          <p>{workshop.make}</p>
          <dl className="workshop-meta">
            <div><dt>Session</dt><dd>{day} · {time}</dd></div>
            <div><dt>Duration</dt><dd>{workshop.duration}</dd></div>
            <div><dt>Included</dt><dd>All materials, guidance & a café drink</dd></div>
            <div><dt>Bring</dt><dd>Curiosity and comfortable clothing</dd></div>
            <div><dt>Suitable for</dt><dd>Ages 16+ · Beginners welcome</dd></div>
            <div><dt>Sample availability</dt><dd>{workshop.spots} spots · {money(workshop.price)} / person</dd></div>
          </dl>
          <button className="button" onClick={() => setStep('reserve')}>Reserve a Spot <span aria-hidden="true">→</span></button>
          <p className="form-note">Sample schedule. Session and availability will be confirmed by email after your request.</p>
        </>
      )}
    </Modal>
  )
}

export default function Workshops() {
  const [schedule, setSchedule] = useState('Weekday Schedule')
  const [selected, setSelected] = useState(null)
  const weekend = schedule === 'Weekend Schedule'
  return (
    <>
      <PageIntro eyebrow="A LITTLE CURIOSITY GOES A LONG WAY" title="Leave with more than a coffee.">
        Relaxing creative sessions alongside the café. A drink, a little guidance, and something made by you.
      </PageIntro>
      <section className="section catalog">
        <div className="schedule-switch">
          <p className="eyebrow">FIND YOUR MOMENT</p>
          <Filters label="Workshop schedule" values={['Weekday Schedule', 'Weekend Schedule']} value={schedule} onChange={setSchedule} />
          <p className="schedule-selection" role="status">{weekend ? 'Saturday & Sunday' : 'Monday – Friday'} · The same six creative experiences, at a different pace.</p>
        </div>
        <p className="schedule-note">Recurring sample sessions · No specific date is booked · All sessions include a signature drink · All sessions in {cafe.location} · {cafe.timeZoneLabel}</p>
        <div className="grid three">
          {workshops.map(item => (
            <article className="workshop-card" key={item.name}>
              <Image src={item.image} alt={item.type} />
              <div className="workshop-body">
                <p className="eyebrow">{item.type} · Beginner friendly</p>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <dl className="workshop-meta">
                  <div><dt>Weekly session</dt><dd>{weekend ? item.weekendDay : item.day}</dd></div>
                  <div><dt>Time</dt><dd>{weekend ? item.weekendTime : item.time}</dd></div>
                  <div><dt>Duration</dt><dd>{item.duration}</dd></div>
                  <div><dt>Per person</dt><dd>{money(item.price)}</dd></div>
                </dl>
                <div className="card-bottom">
                  <span className="spots">{item.spots} places available*</span>
                  <button className="text-link" aria-label={`Details and reservation for ${item.name}`} onClick={() => setSelected(item)}>Details & Reserve <span aria-hidden="true">→</span></button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="catalog-note">*Illustrative weekly schedule and availability. All six workshops welcome beginners.<br />Materials and a signature café drink are included in every session.</p>
      </section>
      {selected && <ReservationForm workshop={selected} day={weekend ? selected.weekendDay : selected.day} time={weekend ? selected.weekendTime : selected.time} onClose={() => setSelected(null)} />}
    </>
  )
}
