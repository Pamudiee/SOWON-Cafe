import { useState } from 'react'
import { Image, Modal } from './UI'
import { money } from '../data/catalog'
import { giftPricing } from '../data/cafe'

const palettes = ['Warm ivory', 'Muted sage', 'Soft blush']
const styles = {
  'Coffee Sets': ['Whole bean', 'Ground for filter', 'Coffee sachets'],
  Mugs: ['Classic rounded', 'Tall everyday'],
  'Gift Boxes': ['Coffee & calm', 'Creative afternoon'],
  Cards: ['Folded card', 'Postcard'],
  'Mini Keepsakes': ['Heart charm', 'Little moon'],
  'Customized Plushies': ['Little bear', 'Sleepy bunny', 'Cozy cat'],
  'Handmade Flowers': ['Petite bouquet', 'Single statement bloom'],
  Chocolates: ['Milk chocolate', 'Dark chocolate', 'Mixed assortment'],
}
const nameLabels = {
  Mugs: 'Name on the mug', Cards: 'Recipient’s name',
  'Mini Keepsakes': 'Initials or name', 'Customized Plushies': 'Name on the tag',
}

export default function GiftCustomizer({ item, onClose }) {
  const [color, setColor] = useState(palettes[0])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [packaging, setPackaging] = useState('Signature kraft')
  const [style, setStyle] = useState(styles[item.category][0])
  const [extras, setExtras] = useState([])
  const [done, setDone] = useState(false)
  const packagingPrice = packaging === 'Ribbon keepsake box' ? giftPricing.keepsakePackaging : 0
  const total = item.price + packagingPrice + extras.reduce((sum, extra) => sum + giftPricing.addOns[extra], 0)
  const options = item.category === 'Gift Boxes'
    ? ['Coffee sachets', 'Mini candle', 'Chocolate bites']
    : ['Message card', 'Mini candle']
  const summary = (
    <section className="order-summary" aria-label="Live gift summary">
      <p className="eyebrow">YOUR GIFT, AT A GLANCE</p>
      <h3>{item.name}</h3>
      <dl className="summary-details">
        <div><dt>Style</dt><dd>{style}</dd></div>
        <div><dt>Palette</dt><dd>{color}</dd></div><div><dt>Gift note</dt><dd>{message ? 'Included below' : 'No note added'}</dd></div>
        {name && <div><dt>Personalization</dt><dd>{name}</dd></div>}
        {message && <div><dt>Your words</dt><dd>“{message}”</dd></div>}
        <div><dt>Gift</dt><dd>{money(item.price)}</dd></div>
        <div><dt>{packaging}</dt><dd>{packagingPrice ? money(packagingPrice) : 'Included'}</dd></div>
        {extras.map(extra => <div key={extra}><dt>{extra}</dt><dd>{money(giftPricing.addOns[extra])}</dd></div>)}
      </dl>
      <div className="summary-total" role="status" aria-live="polite"><span>Sample total</span><strong>{money(total)}</strong></div>
      <p className="form-note">Illustrative price · No checkout or payment</p>
    </section>
  )

  return (
    <Modal className="gift-modal" title={done ? 'A thoughtful little creation.' : 'Make it their own.'} onClose={onClose}>
      {done ? (
        <div className="success">
          <p className="preview-notice" role="status">Your gift preview is ready. No request has been sent and no order has been placed.</p>
          {summary}
          <button className="button" onClick={() => setDone(false)}>Edit my gift</button>
        </div>
      ) : (
        <form className="gift-form" onSubmit={event => { event.preventDefault(); setDone(true) }}>
          <div className="custom-preview" data-palette={color}>
            <Image src={item.image} alt={item.name} />
            <div><p className="eyebrow">01 / YOUR CHOSEN GIFT</p><h3>{item.name}</h3><p>{name || 'A little something, just for them.'}</p><small>Illustrative product photograph</small></div>
          </div>
          <fieldset className="custom-options">
            <legend>02 / Make it personal</legend>
            <div className="form-grid">
              <label>{item.category === 'Coffee Sets' ? 'Coffee format' : 'Style'}<select value={style} onChange={e => setStyle(e.target.value)}>{styles[item.category].map(value => <option key={value}>{value}</option>)}</select></label>
              <fieldset className="palette-options"><legend>{['Mugs', 'Customized Plushies', 'Handmade Flowers'].includes(item.category) ? 'Product color palette' : 'Wrapping color palette'}</legend><div>{palettes.map(value => <label key={value} data-palette={value}><input type="radio" name="gift-palette" value={value} checked={color === value} onChange={() => setColor(value)} /><span className="color-chip" aria-hidden="true" />{value}</label>)}</div></fieldset>
              {nameLabels[item.category] && <label>{nameLabels[item.category]} <span className="field-hint">Optional · up to 24 characters</span><input value={name} onChange={e => setName(e.target.value)} maxLength={24} placeholder="e.g. Mina" /></label>}
              <label>Packaging<select value={packaging} onChange={e => setPackaging(e.target.value)}><option value="Signature kraft">Signature kraft · included</option><option value="Ribbon keepsake box">Ribbon keepsake box · +{money(giftPricing.keepsakePackaging)}</option></select></label>
            </div>
            <label>Personal message <span className="field-hint">Included gift note · optional</span><textarea value={message} onChange={e => setMessage(e.target.value)} maxLength={250} rows={3} placeholder="A little joy, just for you…" /></label>
          </fieldset>
          <fieldset className="extras"><legend>{item.category === 'Gift Boxes' ? 'Add to your curated box' : 'A little extra'} · priced individually</legend>{options.map(option => <label className="checkbox" key={option}><input type="checkbox" checked={extras.includes(option)} onChange={e => setExtras(e.target.checked ? [...extras, option] : extras.filter(extra => extra !== option))} />{option} · {money(giftPricing.addOns[option])}</label>)}</fieldset>
          <div className="gift-review"><p className="eyebrow">03 / REVIEW YOUR LITTLE CREATION</p>
          {summary}</div>
          <p className="form-note">Preview your request below. Your choices stay in this window and are not sent or saved.</p>
          <button className="button full-width" type="submit">Preview Customization Request <span aria-hidden="true">↗</span></button>
        </form>
      )}
    </Modal>
  )
}
