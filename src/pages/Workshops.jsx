import { useState } from 'react'
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
      <div className="summary-total"><span>Sample total</span><strong>{money(workshop.price * guests)}</strong></div>
    </section>
  )
}

function ReservationPreview({ workshop, day, time, onClose }) {
  const [step, setStep] = useState('details')
  const [guests, setGuests] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [attempted, setAttempted] = useState(false)
  const title = step === 'complete' ? 'Your little plan is ready.' : step === 'reserve' ? 'Make room for a moment.' : workshop.name
  return (
    <Modal title={title} onClose={onClose}>
      {step === 'complete' ? (
        <div className="success" role="status">
          <span aria-hidden="true">✳</span>
          <p>Your reservation preview is complete. Nothing has been sent and no spot has been booked.</p>
          <ReservationSummary workshop={workshop} day={day} time={time} guests={guests} />
          <div className="form-actions"><button className="button" onClick={onClose}>Keep exploring</button><button className="text-link" onClick={() => setStep('reserve')}>Edit preview</button></div>
        </div>
      ) : step === 'reserve' ? (
        <form className={attempted ? 'validation-attempted' : ''} onInvalid={() => setAttempted(true)} onSubmit={event => { event.preventDefault(); setStep('complete') }}>
          <ReservationSummary workshop={workshop} day={day} time={time} guests={guests} />
          <p className="form-note">Explore a sample reservation. Your details will not be sent or saved.</p>
          <label>Your name<input required value={name} onChange={event => setName(event.target.value)} autoComplete="name" maxLength={80} /></label>
          <label>Email address<input required value={email} onChange={event => setEmail(event.target.value)} type="email" autoComplete="email" /></label>
          <label>Guests
            <select value={guests} onChange={event => setGuests(Number(event.target.value))}>
              {Array.from({ length: workshop.spots }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
            </select>
          </label>
          {attempted && <p className="validation-hint">Please add your name and a valid email address.</p>}
          <p className="reservation-total" role="status">{money(workshop.price)} × {guests} {guests === 1 ? 'guest' : 'guests'} <strong>{money(workshop.price * guests)}</strong></p>
          <button className="text-link back-link" type="button" onClick={() => setStep('details')}>← Workshop details</button>
          <button className="button" type="submit">Preview Reservation <span aria-hidden="true">↗</span></button>
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
          <button className="button" onClick={() => setStep('reserve')}>Reserve a Spot <span aria-hidden="true">↗</span></button>
          <p className="form-note">Sample schedule. Reservations are a frontend preview.</p>
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
                  <button className="text-link" aria-label={`Details and reservation for ${item.name}`} onClick={() => setSelected(item)}>Details & Reserve <span aria-hidden="true">↗</span></button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="catalog-note">*Illustrative weekly schedule and availability. All six workshops welcome beginners.<br />Materials and a signature café drink are included in every session.</p>
      </section>
      {selected && <ReservationPreview workshop={selected} day={weekend ? selected.weekendDay : selected.day} time={weekend ? selected.weekendTime : selected.time} onClose={() => setSelected(null)} />}
    </>
  )
}
